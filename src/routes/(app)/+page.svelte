<script lang="ts">
  import type { ActionData } from './$types'
  import { applyAction, enhance, type SubmitFunction } from '$app/forms'
  import { invalidate } from '$app/navigation'

  export let form: ActionData
  let loading = false

  const handleSubmit: SubmitFunction = () => {
    loading = true
    return async ({ result }) => {
      if (result.type === 'redirect') {
        await invalidate('supabase:auth')
      } else {
        await applyAction(result)
      }
      loading = false
    }
  }
</script>

<section class="max-w-sm mx-auto">
  <div class="prose">
    <h1 class="">Sign in</h1>
    {#if form?.error}
      <div class="alert alert-error">{form.error}</div>
    {/if}
    <form method="post" use:enhance={handleSubmit}>
      <label for="email" class="label">Email</label>
      <p class="flex items-center gap-6">
        <input
          id="email"
          name="email"
          value={form?.values?.email ?? ''}
          class="input input-bordered w-full"
          type="email"
          placeholder="Email"
          required
        />
      </p>
      <label for="password" class="label">Password</label>
      <p class="flex items-center gap-6">
        <input
          id="password"
          name="password"
          class="input input-bordered w-full"
          type="password"
          placeholder="Password"
          required
        />
      </p>
      <p class="flex items-center gap-6 mt-6">
        <button disabled={loading} class="btn btn-primary">Sign in</button>
      </p>
    </form>

    <p class="text-center">
      Don't have an account? <a class="link" href="/signup">Sign up</a>
    </p>
  </div>
</section>
