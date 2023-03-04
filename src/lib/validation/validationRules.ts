import { z } from 'zod'

// TODO: Validation should match the backend validation / set max lengths
export const required = (name: string) => z.string().min(1, `${name} is required`)
export const email = (name: string) => required(name).email(`${name} is not a valid email`)
export const password = (number = 8, name = 'Password') => required(name).min(number, `${name} must be at least ${number} characters`)