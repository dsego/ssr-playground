import { z } from "./deps.js";

export const User = z.object({
  name: z.string().optional(),
  username: z.string().min(3).max(64),
  email: z.string().email(),
  password: z.string().min(8),
  avatar: z.string().url().optional(),
});
