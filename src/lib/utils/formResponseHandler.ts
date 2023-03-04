import type { ZodError } from 'zod'

export const formatError = (zodError: ZodError) => {
  const formattedErrors: Record<string, string> = {}
  zodError.errors.forEach((err) => {
    const fieldName = err.path.pop() as string
    if (formattedErrors[fieldName] == null) {
      formattedErrors[fieldName] = err.message
    }
  })
  return formattedErrors
}

export const successResponse = <T extends Record<string, unknown> | undefined>(
  message: string,
  data?: T
) => ({
  success: true,
  message,
  ...data,
})

export const faultResponse = <T extends Record<string, unknown> | undefined>(
  message: string,
  data?: T
) => ({
  success: false,
  message,
  ...data,
})
