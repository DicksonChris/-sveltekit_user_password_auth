import { test, expect } from '@playwright/test'
import { signUp, signOut, signIn, startSupabase, generateRandomEmail } from './utils.js'

test.describe('Sign up user', () => {
	const prefix = 'signup'
	const password = 'password123'
	test.beforeAll(startSupabase)
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('new user can signup', async ({ page }) => {
		const email = generateRandomEmail(prefix)
		await signUp({ page, email, password, prefix })
	})

	test('after signing up, user can sign out and sign in', async ({ page }) => {
		const email = generateRandomEmail(prefix)
		await test.step('user signs up', async () => {
			await signUp({ page, email, password, prefix })
		})
		await test.step('user sign out', async () => {
			await signOut(page)
		})
		await test.step('user signs in', async () => {
			await signIn({ page, email, password })
		})
	})

	test('user is logged in on a new tab', async ({ context, page }) => {
		const email = generateRandomEmail(prefix)
		await test.step('sign up and sign in on one tab', async () => {
			await signUp({ page, email, password, prefix })
		})
		await test.step('go to new tab', async () => {
			const newTab = await context.newPage()
			await newTab.goto('/')
		})
		await test.step('check if user is logged in', async () => {
			await page.getByText('Menu').click()
			const logoutButton = page.getByRole('list').getByRole('button', { name: 'Log Out' })
			await expect(logoutButton).toBeVisible()
		})
	})

	test('a logged out user goes to "/signin" if they visit "/profile"', async ({ page }) => {
		await page.goto('/profile')
		await page.waitForURL('/signin')
		const signInHeading = page.getByRole('heading', {
			name: 'Sign In'
		})
		await expect(signInHeading).toHaveText('Sign In')
	})
})

// test('cannot access update email page', async ({ page }) => {
//   await page.goto('/account/update-email')
//   const signInHeading = page.getByRole('heading', {
//     name: 'Sign in',
//   })
//   await expect(signInHeading).toHaveText('Sign In')
// })

// test('cannot access update password page', async ({ page }) => {
//   await page.goto('/account/update-password')
//   const signInHeading = page.getByRole('heading', {
//     name: 'Sign In',
//   })
//   await expect(signInHeading).toHaveText('Sign In')
// })
