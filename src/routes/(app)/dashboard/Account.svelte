<script lang="ts">
  // Import the onMount function from svelte
  import { onMount } from 'svelte'

  // Import the AuthSession type from the supabase library
  import type { AuthSession } from '@supabase/supabase-js'

  // Import the supabase client instance
  import { supabaseClient } from '$lib/db'

  // Import the Avatar component
  import Avatar from './Avatar.svelte'

  // Declare an exported session property of type AuthSession
  export let session: AuthSession

  // Declare local variables for loading, username, website, and avatar URL
  let loading = false
  let username: string | null = null
  let website: string | null = null
  let avatarUrl: string | null = null

  // Call the getProfile function when the component is mounted
  onMount(() => {
    getProfile()
  })

  // The getProfile function retrieves the user's profile information from the "profiles" table in the supabase database
  const getProfile = async () => {
    try {
      // Set loading to true while the profile information is being retrieved
      loading = true

      // Get the user information from the session
      const { user } = session
      // Get the profile information for the current user from the "profiles" table in the supabase database
      const { data, error, status } = await supabaseClient
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      // If profile information was retrieved successfully, update the local variables with the data
      if (data) {
        username = data.username
        website = data.website
        avatarUrl = data.avatar_url
      }

      // If there was an error, throw it
      if (error && status !== 406) throw error
    } catch (error) {
      // If the error is an instance of Error, display an alert with the error message
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      // Set loading to false after the profile information has been retrieved or an error has been thrown
      loading = false
    }
  }

  // The updateProfile function updates the user's profile information in the "profiles" table in the supabase database
  async function updateProfile() {
    try {
      // Set loading to true while the profile information is being updated
      loading = true

      // Get the user information from the session
      const { user } = session

      // Build the updates object with the updated profile information
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toDateString(),
      }

      // Update the user's profile by calling the upsert method from the 'profiles' table
      let { error } = await supabaseClient.from('profiles').upsert(updates)

      // Check for any errors and display an alert with the error message if there is one
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      // Set the loading status to false
      loading = false
    }
  }

  async function signOut() {
    try {
      loading = true
      let { error } = await supabaseClient.auth.signOut()
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      loading = false
    }
  }
</script>

<form class="form-widget" on:submit|preventDefault={updateProfile}>
  <Avatar bind:url={avatarUrl} size={10} on:upload={updateProfile} />
  <div>
    <label for="email">Email</label>
    <input id="email" type="text" value={session.user.email} disabled />
  </div>
  <div>
    <label for="username">Name</label>
    <input id="username" type="text" bind:value={username} />
  </div>
  <div>
    <label for="website">Website</label>
    <input id="website" type="website" bind:value={website} />
  </div>

  <div>
    <input
      type="submit"
      class="button block primary"
      value={loading ? 'Loading...' : 'Update'}
      disabled={loading}
    />
  </div>

  <div>
    <button class="button block" on:click={signOut} disabled={loading}> Sign Out </button>
  </div>
</form>
