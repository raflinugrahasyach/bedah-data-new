import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

async function fix() {
  const realPath = path.resolve("storage/datasets/data_motivasi_hasil_belajar_120.csv");
  const res = await prisma.dataset.updateMany({
    data: { storageKey: realPath },
  });
  console.log("Updated dataset storageKey to real file:", res.count);

  // Set one project to IN_PROGRESS so we can test validating it live
  const project = await prisma.project.findFirst({
    where: { title: "Evaluasi Pembelajaran Digital" },
  });
  if (project) {
    await prisma.project.update({
      where: { id: project.id },
      data: { status: "IN_PROGRESS" },
    });
    console.log("Reset Evaluasi Pembelajaran Digital to IN_PROGRESS for testing");
  }
}

fix()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

