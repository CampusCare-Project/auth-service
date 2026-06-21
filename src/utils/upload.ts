import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const uploadDir = path.join(process.cwd(), "public", "uploads", "reports");

export async function saveReportPhoto(file: File): Promise<string> {
  await mkdir(uploadDir, { recursive: true });

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format foto harus jpg, png, atau webp");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("Ukuran foto maksimal 5MB");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${extension}`;
  const filepath = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filepath, buffer);

  return `/uploads/reports/${filename}`;
}

export async function deleteReportPhoto(photoUrl: string) {
  try {
    const filename = photoUrl.split("/").pop();

    if (!filename) return;

    const filepath = path.join(uploadDir, filename);

    await unlink(filepath);
  } catch {
    // File mungkin sudah tidak ada, jadi tidak perlu throw error
  }
}