import * as z from 'zod';

export const signupWithPassSchema = z.discriminatedUnion('user_type', [
  z.object({
    user_type: z.literal('admin_staff'),
    name: z.string().trim().min(1, { message: 'name_empty' }),
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: 'email_invalid' })),
    access_token: z
      .string()
      .min(1, { message: 'token_empty' })
      .length(8, { message: 'token_len' }),
    password: z
      .string()
      .min(1, { message: 'pass_empty' })
      .min(8, { message: 'pass_small' })
      .regex(/[a-z]/, {
        message: 'pass_lower',
      })
      .regex(/[A-Z]/, {
        message: 'pass_upper',
      })
      .regex(/[0-9]/, { message: 'pass_num' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'pass_special',
      }),
  }),

  z.object({
    user_type: z.literal('user'),
    name: z.string().trim().min(1, { message: 'name_empty' }),
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: 'email_invalid' })),
    password: z
      .string()
      .min(1, { message: 'pass_empty' })
      .min(8, { message: 'pass_small' })
      .regex(/[a-z]/, {
        message: 'pass_lower',
      })
      .regex(/[A-Z]/, {
        message: 'pass_upper',
      })
      .regex(/[0-9]/, { message: 'pass_num' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'pass_special',
      }),
  }),
]);

export const signupSchema = z.discriminatedUnion('user_type', [
  z.object({
    user_type: z.literal('admin_staff'),
    name: z.string().trim().min(1, { message: 'name_empty' }),
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: 'email_invalid' })),
    access_token: z
      .string()
      .min(1, { message: 'token_empty' })
      .length(8, { message: 'token_len' }),
  }),

  z.object({
    user_type: z.literal('user'),
    name: z.string().trim().min(1, { message: 'name_empty' }),
    email: z
      .string()
      .trim()
      .pipe(z.email({ message: 'email_invalid' })),
  }),
]);

export const signinSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: 'email_invalid' })),
  password: z.string().min(1, 'pass_small'),
});

export type SignupSchema = z.infer<typeof signinSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
