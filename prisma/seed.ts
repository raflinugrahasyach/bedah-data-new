import { PrismaClient, Role, UserType, PlanTier, ProjectStatus, AnalysisMethod, AnalysisStatus, ValidationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Bedah Data database...");

  // 1. Seed Plans (Brief Section 5)
  const plans = [
    {
      tier: PlanTier.FREE,
      name: "Free",
      priceMonthly: 0,
      priceYearly: 0,
      maxProjects: 1,
      maxRows: 500,
      maxChatPerDay: 5,
      accessCorrelation: "LIMITED",
      accessSimpleReg: "LIMITED",
      accessMultiReg: "NONE",
      validationLevel: "BASIC",
      exportFormats: [],
      premiumTemplates: false,
      institutionTemplates: false,
      advancedBatch: false,
      multiUserDashboard: false,
      onboarding: false,
    },
    {
      tier: PlanTier.STUDENT,
      name: "Student",
      priceMonthly: 49000,
      priceYearly: 490000,
      maxProjects: 5,
      maxRows: 5000,
      maxChatPerDay: 30,
      accessCorrelation: "FULL",
      accessSimpleReg: "FULL",
      accessMultiReg: "FULL",
      validationLevel: "FULL",
      exportFormats: ["PDF", "DOCX"],
      premiumTemplates: false,
      institutionTemplates: false,
      advancedBatch: false,
      multiUserDashboard: false,
      onboarding: false,
    },
    {
      tier: PlanTier.RESEARCHER,
      name: "Researcher",
      priceMonthly: 99000,
      priceYearly: 990000,
      maxProjects: null, // Unlimited
      maxRows: 10000,
      maxChatPerDay: null, // Unlimited fair use
      accessCorrelation: "FULL",
      accessSimpleReg: "FULL",
      accessMultiReg: "FULL",
      validationLevel: "FULL",
      exportFormats: ["PDF", "DOCX"],
      premiumTemplates: true,
      institutionTemplates: false,
      advancedBatch: true,
      multiUserDashboard: false,
      onboarding: false,
    },
    {
      tier: PlanTier.CAMPUS,
      name: "Campus / Institutional",
      priceMonthly: 0,
      priceYearly: 15000000,
      maxProjects: null,
      maxRows: 10000,
      maxChatPerDay: null,
      accessCorrelation: "FULL",
      accessSimpleReg: "FULL",
      accessMultiReg: "FULL",
      validationLevel: "FULL",
      exportFormats: ["PDF", "DOCX"],
      premiumTemplates: true,
      institutionTemplates: true,
      advancedBatch: true,
      multiUserDashboard: true,
      onboarding: true,
    },
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { tier: p.tier },
      update: p,
      create: p,
    });
  }
  console.log("✓ Plans seeded");

  // 2. Demo Passwords
  const penelitiEmail = process.env.DEMO_PENELITI_EMAIL || "peneliti@bedahdata.id";
  const penelitiPassword = process.env.DEMO_PENELITI_PASSWORD || "BedahDataPeneliti2026!";
  const adminEmail = process.env.DEMO_ADMIN_EMAIL || "admin@bedahdata.id";
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || "BedahDataAdmin2026!";

  const hashedPenelitiPassword = await bcrypt.hash(penelitiPassword, 10);
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  // 3. Demo Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Super Admin Bedah Data",
      passwordHash: hashedAdminPassword,
      role: Role.ADMIN,
      isDemo: true,
    },
    create: {
      name: "Super Admin Bedah Data",
      email: adminEmail,
      emailVerified: new Date(),
      passwordHash: hashedAdminPassword,
      role: Role.ADMIN,
      userType: UserType.PENELITI,
      isDemo: true,
      consentAt: new Date(),
      lastActiveAt: new Date(),
    },
  });
  console.log(`✓ Admin user ready: ${adminUser.email}`);

  // 4. Demo Peneliti User
  const penelitiUser = await prisma.user.upsert({
    where: { email: penelitiEmail },
    update: {
      name: "Peneliti Riset",
      passwordHash: hashedPenelitiPassword,
      role: Role.PENELITI,
      isDemo: true,
    },
    create: {
      name: "Peneliti Riset",
      email: penelitiEmail,
      emailVerified: new Date(),
      passwordHash: hashedPenelitiPassword,
      role: Role.PENELITI,
      userType: UserType.PENELITI,
      isDemo: true,
      consentAt: new Date(),
      lastActiveAt: new Date(),
    },
  });
  console.log(`✓ Peneliti user ready: ${penelitiUser.email}`);

  // Ensure subscription for demo peneliti (Researcher plan)
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: penelitiUser.id },
  });
  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        userId: penelitiUser.id,
        tier: PlanTier.RESEARCHER,
        status: "ACTIVE",
      },
    });
  }

  // 5. Seed Mode Contoh Projects (Brief Section 6)
  // 4 proyek, 4 dataset, 3 analisis selesai, 2 hasil tervalidasi
  const sampleProjects = [
    {
      title: "Pengaruh Motivasi terhadap Hasil Belajar",
      description: "Penelitian pengaruh motivasi belajar mahasiswa terhadap hasil belajar akademik.",
      hypothesis: "Motivasi belajar berpengaruh positif dan signifikan terhadap hasil belajar.",
      method: AnalysisMethod.SIMPLE_REGRESSION,
      status: ProjectStatus.VALIDATED,
      rowCount: 120,
      fileName: "data_motivasi_hasil_belajar.xlsx",
      fileType: "xlsx",
      validationStatus: ValidationStatus.PASSED,
      analysisDone: true,
    },
    {
      title: "Hubungan Durasi Belajar dan Prestasi",
      description: "Analisis korelasi antara durasi belajar harian dan indeks prestasi kumulatif.",
      hypothesis: "Terdapat hubungan linear positif antara durasi belajar dan prestasi.",
      method: AnalysisMethod.PEARSON,
      status: ProjectStatus.VALIDATED,
      rowCount: 85,
      fileName: "durasi_dan_prestasi_85.csv",
      fileType: "csv",
      validationStatus: ValidationStatus.PASSED,
      analysisDone: true,
    },
    {
      title: "Survei Pengalaman Belajar Mahasiswa",
      description: "Analisis distribusi kepuasan dan pengalaman belajar metode blended learning.",
      hypothesis: "Tingkat kepuasan mahasiswa berada di atas rata-rata nasional.",
      method: AnalysisMethod.DESCRIPTIVE,
      status: ProjectStatus.COMPLETED,
      rowCount: 64,
      fileName: "survei_pengalaman_blended.xlsx",
      fileType: "xlsx",
      validationStatus: ValidationStatus.PENDING,
      analysisDone: true,
    },
    {
      title: "Evaluasi Pembelajaran Digital",
      description: "Studi komparasi efektivitas platform pembelajaran digital.",
      hypothesis: "Kualitas infrastruktur digital menentukan pemahaman materi perkuliahan.",
      method: AnalysisMethod.SIMPLE_REGRESSION,
      status: ProjectStatus.IN_PROGRESS,
      rowCount: 150,
      fileName: "evaluasi_pembelajaran_digital.csv",
      fileType: "csv",
      validationStatus: ValidationStatus.PENDING,
      analysisDone: false,
    },
  ];

  for (const sp of sampleProjects) {
    let proj = await prisma.project.findFirst({
      where: { ownerId: penelitiUser.id, title: sp.title },
    });

    if (!proj) {
      proj = await prisma.project.create({
        data: {
          ownerId: penelitiUser.id,
          title: sp.title,
          description: sp.description,
          hypothesis: sp.hypothesis,
          method: sp.method,
          status: sp.status,
        },
      });

      const dataset = await prisma.dataset.create({
        data: {
          ownerId: penelitiUser.id,
          projectId: proj.id,
          fileName: sp.fileName,
          fileType: sp.fileType,
          fileSize: 45000,
          storageKey: `datasets/${penelitiUser.id}/${sp.fileName}`,
          rowCount: sp.rowCount,
          columnCount: 5,
          variables: [
            { name: "no", type: "NUMERIC", missing: 0, unique: sp.rowCount },
            { name: "responden", type: "CATEGORICAL", missing: 0, unique: sp.rowCount },
            { name: "motivasi_belajar", type: "NUMERIC", missing: 0, unique: 45 },
            { name: "hasil_belajar", type: "NUMERIC", missing: 0, unique: 52 },
            { name: "jam_belajar", type: "NUMERIC", missing: 0, unique: 20 },
          ],
        },
      });

      if (sp.analysisDone) {
        const analysis = await prisma.analysisResult.create({
          data: {
            projectId: proj.id,
            datasetId: dataset.id,
            method: sp.method,
            status: AnalysisStatus.DONE,
            params: { x: "motivasi_belajar", y: "hasil_belajar" },
            result: {
              summary: "R = 0.742, R² = 0.551, F = 144.6, p < 0.001",
              interpretation:
                "Motivasi belajar berpengaruh positif dan signifikan terhadap hasil belajar (p < 0,05). Motivasi menjelaskan 55,1% variasi hasil belajar.",
            },
          },
        });

        if (sp.status === ProjectStatus.VALIDATED) {
          await prisma.validation.create({
            data: {
              analysisId: analysis.id,
              status: ValidationStatus.PASSED,
              tolerance: 0.000001,
              checks: [
                { check: "Kelengkapan data", passed: true, detail: "100% data valid tanpa missing values" },
                { check: "Kecukupan sampel", passed: true, detail: `N = ${sp.rowCount} melebihi batas minimal (N >= 30)` },
                { check: "Normalitas residual", passed: true, detail: "Shapiro-Wilk p = 0.284 (> 0.05 normal)" },
                { check: "Komputasi independen", passed: true, detail: "Selisih toleransi 0.000000 vs Scipy engine" },
              ],
            },
          });
        }
      }
    }
  }
  console.log("✓ Sample projects & datasets seeded");

  // 6. Platform Settings
  await prisma.setting.upsert({
    where: { key: "demo_accounts_enabled" },
    update: { value: true },
    create: { key: "demo_accounts_enabled", value: true },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

