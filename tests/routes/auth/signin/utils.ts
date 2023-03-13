import type { AuthUserSchema, ForgotPasswordSchema } from '$lib/validationSchema'
import { expect, type Page } from '@playwright/test'
import type { z } from 'zod'
import { faker } from '@faker-js/faker'
import { execSync } from 'child_process'
import tcpPortUsed from 'tcp-port-used'

type AuthUser = z.infer<typeof AuthUserSchema>
type ForgotPasswordUser = z.infer<typeof ForgotPasswordSchema>
type Auth = AuthUser & { page: Page; prefix?: string }
type ForgotPassword = ForgotPasswordUser & { page: Page; prefix?: string }

/**
 * Generates a random email address with a given prefix.
 * @param {string} prefix - The prefix to use for the email address.
 * @returns {string} A random email address with the given prefix.
 */
export const generateRandomEmail = (prefix = 'test') =>
	`${prefix}+${faker.internet.exampleEmail()}`.toLocaleLowerCase()

export async function startSupabase() {
	const inUse = await tcpPortUsed.check(54321)
	if (inUse) {
		return
	}
	console.warn('Supabase not detected - Starting it now')
	execSync('npx supabase start', { stdio: 'ignore' })
}

export async function signUp({ page, email, password, prefix }: Auth) {
	// Click the "Sign Up" link on the homepage
	await page.getByText('Menu').click()
	await page.getByRole('list').getByRole('link', { name: 'Sign Up' }).click()
	await page.getByPlaceholder('Email...').fill(email)
	await page.keyboard.press('Tab')
	await page.getByPlaceholder('Password...', { exact: true }).fill(password)
	await page.keyboard.press('Tab')
	await page.getByPlaceholder('Confirm password...', { exact: true }).fill(password)
	await page.keyboard.press('Tab')
	await page.keyboard.press('Space') // click checkbox
	// await page.getByRole('checkbox', { name: 'terms' }).click()
	await page.getByRole('button', { name: 'Sign Up' }).click()
	const successNotice = page.getByText('Success! Check your email for a confirmation link.')
	await expect(successNotice).toHaveCount(1)
	await checkConfirmationEmail(page, prefix)
	const welcomeNotice = page.getByText(`🎉 Hello there ${email}, you're logged in!`)
	await expect(welcomeNotice).toHaveText(`🎉 Hello there ${email}, you're logged in!`)
	await page.click('#nav-menu-label')
	const logoutButton = page.getByRole('button', { name: 'Log Out' })
	await expect(logoutButton).toBeVisible()
}

export async function signIn({ page, email, password }: Auth) {
	await page.click('#nav-menu-label')
	const loginLink = await page.locator('.dropdown-content > li:first-child > a[href="/signin"]')
	await loginLink.click()
	await page.getByPlaceholder('Email...').fill(email)
	await page.keyboard.press('Tab')
	await page.getByPlaceholder('Password...', { exact: true }).fill(password)
	await page.keyboard.press('Tab')
	await page.keyboard.press('Enter')
	const welcomeNotice = page.getByText(`🎉 Hello there ${email}, you're logged in!`)
	await expect(welcomeNotice).toHaveText(`🎉 Hello there ${email}, you're logged in!`)
	await page.click('#nav-menu-label')
	const logoutButton = page.getByRole('button', { name: 'Log Out' })
	await expect(logoutButton).toBeVisible()
}

export async function signOut(page: Page) {
	await page.click('#nav-menu-label')
	const logoutButton = page.getByRole('button', { name: 'Log Out' })
	await expect(logoutButton).toBeVisible()
	await logoutButton.click()
	await page.waitForURL('/')
}

// export async function forgotPassword({ page, email, prefix }: ForgotPassword) {
// 	await page.getByRole('link', { name: 'Forgot Password?' }).click();
// 	await page.getByLabel('Email').fill(email);
// 	await page.getByRole('button', { name: 'Send' }).click();
// 	const successNotice = page.getByText(
// 		'Please check your email for a password reset link to log into the website.'
// 	);
// 	await expect(successNotice).toHaveCount(1);
// 	await checkResetPasswordEmail(page, prefix);
// 	await page.waitForURL('/account/update-password');
// 	const updatePasswordTitle = page
// 		.locator('h2')
// 		.filter({
// 			hasText: 'Update Password'
// 		})
// 		.first();
// 	await expect(updatePasswordTitle).toHaveCount(1);
// 	const logoutButton = page.getByRole('link', { name: 'Sign out' });
// 	await expect(logoutButton).toHaveText('Sign out');
// }

// This function opens the confirmation email sent by the app and clicks the "Confirm your email address" link.
// It expects the app to be running on http://localhost:54324 (the default for Playwright Test).
// The "prefix" argument can be used to distinguish emails sent by different test runs.
async function checkConfirmationEmail(page: Page, prefix = 'test') {
	await page.goto(`http://localhost:54324/m/${prefix}`)
	await page.locator('.message-list > :first-child').click()
	await page.getByRole('link', { name: 'Confirm your email address' }).click()
}

// async function checkResetPasswordEmail(page: Page, prefix = 'test') {
// 	await page.goto(`http://localhost:54324/m/${prefix}`);
// 	await page.locator('.message-list > :first-child').click();
// 	await page.getByRole('link', { name: 'Reset password' }).click();
// }
