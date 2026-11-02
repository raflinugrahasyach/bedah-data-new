import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = (formData.get("projectId") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();

    // 1. SPSS Rejection Rule
    if (ext === ".sav") {
      return NextResponse.json(
        {
          error:
            "File SPSS (.sav) tidak didukung. Silakan ekspor ke format Excel (.xlsx/.xls) atau CSV terlebih dahulu.",
        },
        { status: 400 }
      );
    }

    // Allowed formats: .csv, .xlsx, .xls
    if (![".csv", ".xlsx", ".xls"].includes(ext)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Hanya CSV, XLSX, dan XLS yang diizinkan." },
        { status: 400 }
      );
    }

    // 2. File Size Limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file melebihi batas maksimal 10 MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Parse Workbook with SheetJS
    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buffer, { type: "buffer" });
    } catch (err: any) {
      return NextResponse.json(
        { error: `Gagal membaca file: ${err.message}` },
        { status: 400 }
      );
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      return NextResponse.json({ error: "Sheet data tidak ditemukan dalam file." }, { status: 400 });
    }

    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: null });
    const rowCount = rawRows.length;

    if (rowCount === 0) {
      return NextResponse.json({ error: "File tidak memiliki data (kosong)." }, { status: 400 });
    }

    // 4. Max Rows Limit: 10,000
    if (rowCount > 10000) {
      return NextResponse.json(
        { error: `Jumlah baris (${rowCount}) melebihi batas maksimal 10.000 baris.` },
        { status: 400 }
      );
    }

    const columns = Object.keys(rawRows[0] || {});
    const columnCount = columns.length;

    // 5. Max Columns Limit: 50
    if (columnCount > 50) {
      return NextResponse.json(
        { error: `Jumlah kolom (${columnCount}) melebihi batas maksimal 50 kolom.` },
        { status: 400 }
      );
    }

    // 6. Data Quality & Variable Type Auto-Detection
    let totalMissing = 0;
    const variableTypes: Array<{
      name: string;
      type: "NUMERIC" | "CATEGORICAL" | "ORDINAL";
      missing: number;
      unique: number;
      min?: number;
      max?: number;
    }> = [];

    let totalOutliers = 0;

    for (const col of columns) {
      let missingInCol = 0;
      let numericCount = 0;
      const uniqueVals = new Set<any>();
      const numericVals: number[] = [];

      for (let i = 0; i < rowCount; i++) {
        const val = rawRows[i][col];
        if (val === null || val === undefined || String(val).trim() === "") {
          missingInCol++;
        } else {
          uniqueVals.add(val);
          const num = Number(val);
          if (!isNaN(num)) {
            numericCount++;
            numericVals.push(num);
          }
        }
      }

      totalMissing += missingInCol;
      const validCount = rowCount - missingInCol;
      const isMostlyNumeric = validCount > 0 && numericCount / validCount >= 0.8;

      let detectedType: "NUMERIC" | "CATEGORICAL" | "ORDINAL" = "CATEGORICAL";

      if (isMostlyNumeric) {
        // Check if ordinal (e.g. Likert scale integers between 1 and 7)
        const isLikert =
          uniqueVals.size <= 7 &&
          numericVals.every((n) => Number.isInteger(n) && n >= 1 && n <= 10);

        detectedType = isLikert ? "ORDINAL" : "NUMERIC";

        // Calculate simple IQR outlier detection for numeric columns
        if (numericVals.length >= 8) {
          numericVals.sort((a, b) => a - b);
          const q1 = numericVals[Math.floor(numericVals.length * 0.25)];
          const q3 = numericVals[Math.floor(numericVals.length * 0.75)];
          const iqr = q3 - q1;
          const lower = q1 - 1.5 * iqr;
          const upper = q3 + 1.5 * iqr;
          const outliersInCol = numericVals.filter((v) => v < lower || v > upper).length;
          totalOutliers += outliersInCol;
        }

        variableTypes.push({
          name: col,
          type: detectedType,
          missing: missingInCol,
          unique: uniqueVals.size,
          min: numericVals.length ? Math.min(...numericVals) : undefined,
          max: numericVals.length ? Math.max(...numericVals) : undefined,
        });
      } else {
        variableTypes.push({
          name: col,
          type: "CATEGORICAL",
          missing: missingInCol,
          unique: uniqueVals.size,
        });
      }
    }

    // Detect duplicate rows
    const seenRows = new Set<string>();
    let duplicateCount = 0;
    for (const r of rawRows) {
      const serialized = JSON.stringify(r);
      if (seenRows.has(serialized)) {
        duplicateCount++;
      } else {
        seenRows.add(serialized);
      }
    }

    // 7. Save Raw File to Local Storage (isolated per user)
    const userDir = path.resolve(process.cwd(), "storage", "datasets", session.user.id);
    await fs.mkdir(userDir, { recursive: true });

    const safeBaseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_\-]/g, "_");
    const uniqueFileName = `${Date.now()}_${safeBaseName}${ext}`;
    const targetFilePath = path.join(userDir, uniqueFileName);

    await fs.writeFile(targetFilePath, buffer);

    // 8. Save Dataset Metadata to Database
    const dataset = await db.dataset.create({
      data: {
        ownerId: session.user.id,
        projectId: projectId,
        fileName: originalName,
        fileType: ext.replace(".", ""),
        fileSize: file.size,
        storageKey: targetFilePath,
        sheetName: sheetName,
        rowCount: rowCount,
        columnCount: columnCount,
        variables: variableTypes as any,
        missingCount: totalMissing,
        duplicateCount: duplicateCount,
        outlierCount: totalOutliers,
      },
    });

    // 9. Prepare first 100 rows preview
    const previewRows = rawRows.slice(0, 100);

    return NextResponse.json({
      success: true,
      dataset: {
        id: dataset.id,
        fileName: dataset.fileName,
        fileType: dataset.fileType,
        fileSize: dataset.fileSize,
        rowCount: dataset.rowCount,
        columnCount: dataset.columnCount,
        sheetName: dataset.sheetName,
        variables: variableTypes,
        missingCount: totalMissing,
        duplicateCount: duplicateCount,
        outlierCount: totalOutliers,
      },
      previewRows: previewRows,
      note: `Menampilkan ${previewRows.length} dari ${rowCount} baris. Analisis menggunakan seluruh data yang valid.`,
    });
  } catch (err: any) {
    console.error("Dataset upload error:", err);
    return NextResponse.json(
      { error: `Terjadi kesalahan saat memproses dataset: ${err.message}` },
      { status: 500 }
    );
  }
}

