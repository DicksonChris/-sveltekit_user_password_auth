import { z } from 'zod'

// Fields should match the backend validation
// const nameSchema = z
//   .string({ required_error: 'Name is required' })
//   .min(1, { message: 'Name is required' })
//   .max(64, { message: 'Name must be less than 64 characters' })
//   .trim()
const emailSchema = z
  .string({ required_error: 'Email is required' })
  .min(1, { message: 'Email is required' })
  .max(64, { message: 'Email must be less than 64 characters' })
  .email()
const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(64, { message: 'Password must be less than 64 characters' })
  .trim()
const passwordConfirmSchema = z
  .string({ required_error: 'Confirm your password' })
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(64, { message: 'Password must be less than 64 characters' })
  .trim()

const termsSchema = z.any().refine((value) => value === 'on', {
  message: 'You must accept to the terms and conditions',
  path: ['terms'],
})

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
    terms: termsSchema,
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['password'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['passwordConfirm'],
      })
    }
  })

export const signInSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .superRefine(({ email, password }, ctx) => {
    if (!email || !password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Email and password are required',
        path: ['email'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'Email and password are required',
        path: ['password'],
      })
    }
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['password'],
      })
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords must match',
        path: ['passwordConfirm'],
      })
    }
  })
