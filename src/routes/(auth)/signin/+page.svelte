<script lang="ts">
  import type { ActionData } from './$types'
  import { enhance } from '$app/forms'
  import { faWarning } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'

  export let form: ActionData
  let loading = false
</script>

<section class="max-w-sm mx-auto">
  <div class="prose">
    <h1>Sign In</h1>
  </div>
  <form action="?/signin" method="POST" use:enhance class="flex flex-col gap-6 my-6">
    {#if form?.error}
      <div class="alert alert-error">
        <div>
          <Fa icon={faWarning} />
          {form.error}
        </div>
      </div>
    {/if}
    <p>
      <input
        type="email"
        name="email"
        placeholder="Email..."
        class="input input-bordered w-full"
        required
        value={form?.values?.email ?? ''}
      />
    </p>
    <p>
      <input
        type="password"
        name="password"
        placeholder="Password..."
        class="input input-bordered w-full"
        required
      />
    </p>
    <p class="flex items-center gap-6 mt-6">
      <button disabled={loading} class="btn btn-primary">Sign In</button>
      or
      <a href="/signup" class="link">Sign up</a>
    </p>
  </form>

  {#if form}
    <section class="my-8">
      <h3>Form data:</h3>
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </section>
  {/if}
</section>
