import { z } from 'zod';
export const loginSchema = z.object({
  // email: z.email(),
  identifier: z
    .string()
    .min(1, 'username minimal 6 karakter')
    .max(20, 'username maksimal 20 karakter'),

  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  // email: z.email(),
  name: z
    .string()
    .min(1, 'username minimal 6 karakter')
    .max(100, 'username maksimal 100 karakter'),
  email:z
  .string()
  .min(1,"email tidak boleh kosong")
  .email("Harus format Email yang benar"),
  username: z
    .string()
    .min(1, 'username minimal 6 karakter')
    .max(100, 'username maksimal 100 karakter'),

  passwordHash: z.string().min(6, 'Password minimal 6 karakter'),
});

export const addUsersSchema = z.object({
  // email: z.email(),
  name: z
    .string()
    .min(1, 'username minimal 6 karakter')
    .max(100, 'username maksimal 100 karakter'),
  email:z
  .string()
  .min(1,"email tidak boleh kosong")
  .email("Harus format Email yang benar"),
  username: z
    .string()
    .min(1, 'username minimal 6 karakter')
    .max(100, 'username maksimal 100 karakter'),

  passwordHash: z.string().min(6, 'Password minimal 6 karakter'),
  role:z.enum(["TECHNICIAN","STAFF","STUDENT"], "Tidak bisa tambahkan role admin")
});