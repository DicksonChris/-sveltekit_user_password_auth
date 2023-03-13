import { test, expect } from '@playwright/test'
import { signUp, signOut, signIn, startSupabase, generateRandomEmail } from '../../../utils.js'

test.describe('Sign in page', () => {
	const prefix = 'signin'
	const password = 'password123'
	test.beforeAll(startSupabase)
	test.beforeEach(async ({ page }) => {
		await page.goto('/signin')
	})

	test("errors shown when user doesn't fill out email or password", async ({ page }) => {
		const email = page.getByPlaceholder('Email...')
		const password = page.getByPlaceholder('Password...', { exact: true })

		await test.step('no errors shown when user first visits page', async () => {
			await expect(email).not.toHaveClass(/input-error/)
			await expect(password).not.toHaveClass(/input-error/)
		})
		await test.step('click sign in', async () => {
			const signInButton = page.getByRole('button', { name: 'Sign In' })
			await signInButton.click()
		})

		await test.step('shows errors: error alert and email/password input error', async () => {
			const error = page.getByRole('alert')
			await expect(error).toHaveText('Email or Password is incorrect.')
			await expect(email).toHaveClass(/input-error/)
			await expect(password).toHaveClass(/input-error/)
		})
	})

	test('errors shown when user inputs invalid email and password', async ({ page }) => {
		const email = page.getByPlaceholder('Email...')
		const password = page.getByPlaceholder('Password...', { exact: true })
		await test.step('no errors shown when user first visits page', async () => {
			await expect(email).not.toHaveClass(/input-error/)
			await expect(password).not.toHaveClass(/input-error/)
		})
		await test.step('fill out email and password', async () => {
			await page.getByPlaceholder('Email...').fill('email@email123.com')
			await page
				.getByPlaceholder('Password...', { exact: true })
				.fill('the_incorr3ct_password_for_this_email_address!')
		})
		const signInButton = page.getByRole('button', { name: 'Sign In' })
		await signInButton.click()

		await test.step('shows errors: error alert and email/password input error', async () => {
			const error = page.getByRole('alert')
			await expect(error).toHaveText('Email or Password is incorrect.')
			await expect(email).toHaveClass(/input-error/)
			await expect(password).toHaveClass(/input-error/)
		})

		// await test.step('remove errors when user starts typing', async () => {
		// })

		await test.step('no errors when user refreshes page', async () => {
			await page.reload()
			await expect(email).not.toHaveClass(/input-error/)
			await expect(password).not.toHaveClass(/input-error/)
		})
	})

	test('snapshot made of email but not password', async ({ page }) => {
		await test.step('user navigates from home page to sign in page', async () => {
			await page.goto('/')
			await page.getByText('Menu').click()
			const signInButton = page.getByRole('list').getByRole('link', { name: 'Log In' })
			await signInButton.click()
		})
		const email = generateRandomEmail(prefix)
		await test.step('user fills out email field', async () => {
			await page.fill('input[name="email"]', email)
		})
		await test.step('user fills out password field', async () => {
			await page.fill('input[name="password"]', password)
		})
		await test.step('user navigates to home page', async () => {
			await page.goBack()
		})
		await test.step('user navigates back to sign in page', async () => {
			await page.goForward()
		})
		await test.step('user sees email field filled out', async () => {
			await expect(page.getByPlaceholder('Email...')).toHaveValue(email)
		})
		await test.step('user sees password field empty', async () => {
			await expect(page.getByPlaceholder('Password...')).toHaveValue('')
		})
	})

	test('snapshot functionality in place even with submission error', async ({ page }) => {
		const emailField = page.getByPlaceholder('Email...')
		const passwordField = page.getByPlaceholder('Password...', { exact: true })

		const email = generateRandomEmail(prefix)
		const password = 'irrel3vant_password_for_testing_purposes!'
		await test.step('user fills out email field', async () => {
			await emailField.fill(email)
		})
		await test.step('user fills out password field', async () => {
			await passwordField.fill(password)
		})
		await test.step('user submits invalid credentials', async () => {
			const signInButton = page.getByRole('button', { name: 'Sign In' })
			await signInButton.click()
		})
		await test.step('shows errors', async () => {
			const error = page.getByRole('alert')
			await expect(error).toHaveText('Email or Password is incorrect.')
			await expect(emailField).toHaveClass(/input-error/)
			await expect(passwordField).toHaveClass(/input-error/)
		})
		await test.step('user navigates to sign up page', async () => {
			const signUpButton = page.getByRole('link', { name: 'Sign up' })
			await signUpButton.click()
		})
		await test.step('user navigates back to sign in page', async () => {
			await page.goBack()
		})
		await test.step('user sees email field filled out', async () => {
			await expect(emailField).toHaveValue(email)
		})
		await test.step('user sees password field empty', async () => {
			await expect(passwordField).toHaveValue('')
		})
	})
})
