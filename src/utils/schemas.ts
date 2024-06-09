import { ZodSchema } from 'zod';

export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log(result.error)
    const errors = result.error.errors.map(error => error.message);
    console.log(errors)
    throw new Error(errors.join(','));
  }
  return result.data;
};