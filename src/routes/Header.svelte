<script lang="ts">
	import {
		faBars,
		faChartLine,
		faCog,
		faHeart,
		faRocket,
		faSignIn,
		faSignOut
	} from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import '../app.postcss'

	import type { LayoutData } from './$types'
	export let data: LayoutData

	const SIGNOUT_FORM_REF = 'signout-submit'

	$: menu_items = data.session
		? [
				{
					href: '/profile',
					icon: faChartLine,
					label: 'Profile'
				},
				{
					href: '/settings',
					icon: faCog,
					label: 'Settings'
				},
				{
					href: '/signout',
					icon: faSignOut,
					label: 'Log Out'
				}
		  ]
		: [
				{
					href: '/signin',
					icon: faSignIn,
					label: 'Log In'
				},
				{
					href: '/signup',
					icon: faHeart,
					label: 'Sign Up'
				}
		  ]
</script>

<form id={SIGNOUT_FORM_REF} action="/signout" method="POST" data-sveltekit-reload>
	<button type="submit" class="hidden"> Signout </button>
</form>

<header class="bg-base-200 px-6">
	<div class="max-w-screen-md mx-auto flex items-center py-2">
		<h1>
			<a href="/" class="btn btn-ghost gap-3">
				<Fa icon={faRocket} />
				SvelteKit Auth
			</a>
		</h1>
		<nav class="dropdown dropdown-end ml-auto">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn btn-ghost gap-3" id="nav-menu-label">
				<Fa icon={faBars} />
				Menu
			</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul tabindex="0" class="dropdown-content menu p-2 shadow-md bg-base-200 rounded-box w-52 ">
				{#each menu_items as item}
					<li>
						{#if item.href === '/signout'}
							<button type="submit" form={SIGNOUT_FORM_REF}>
								<Fa icon={item.icon} />
								{item.label}
							</button>
						{:else}
							<a href={item.href}>
								<Fa icon={item.icon} />
								{item.label}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>
