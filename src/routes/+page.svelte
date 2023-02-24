<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<div class="prose">
  <h1>SvelteKit Auth Example</h1>
  <p>This project shows you how to implement a simple authentication system using SvelteKit.</p>
  <p>
    <a
      href="https://github.com/danawoodman/sveltekit-auth-example"
      target="_blank"
      rel="noopen  noreferrer">Checkout the source code here</a
    >.
  </p>
  <p>
    This demo doesn't use a database and instead just stores user data in a server-side cookie. This
    is just for demo purposes. In your application you'd want to connect to some backend system
    instead.
  </p>
  <p>
    Try signing up, signing out, then signing in with that same user credentials then try and API
    request.
  </p>
  <p class="flex items-center gap-4 mt-12">
    {#if data.session}
      <a href="/profile" class="btn btn-primary">Profile</a>
      <a href="/settings" class="btn">Settings</a>
    {:else}
      <a href="/signup" class="btn btn-primary">Sign Up</a>
      <a href="/signin" class="btn">Log In</a>
    {/if}
  </p>
</div>
