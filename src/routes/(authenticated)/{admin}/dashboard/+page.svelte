<script lang="ts">
	import type { PageData } from '../dashboard/$types'

	export let data: PageData
	const session = data.session
	const role = session?.user.role
</script>

<p>Hello {role}</p>
