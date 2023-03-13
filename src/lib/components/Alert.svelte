<script lang="ts">
	let className = ''
	export { className as class }
</script>

<div role="alert" class="alert {className} shadow-lg rounded-md">
	<slot />
</div>
