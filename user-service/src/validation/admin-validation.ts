import { z } from 'zod';
import { USERNAME_REGEX } from '../utils/regex';

export const roleChangeSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3)
        .max(30)
        .regex(USERNAME_REGEX, 'Username cannot contain spaces')
        .transform((v) => v.toLowerCase()),
});

export type RoleChangeBody = z.infer<typeof roleChangeSchema>;
