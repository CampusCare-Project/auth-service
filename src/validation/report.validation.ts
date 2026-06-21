import { z } from "zod";

export const createReportSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter"),

  description: z
    .string()
    .min(5, "Deskripsi minimal 5 karakter"),

  latitude: z.coerce
    .number()
    .min(-90, "Latitude tidak valid")
    .max(90, "Latitude tidak valid"),

  longitude: z.coerce
    .number()
    .min(-180, "Longitude tidak valid")
    .max(180, "Longitude tidak valid"),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;