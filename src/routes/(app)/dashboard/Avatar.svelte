<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { supabaseClient } from '$lib/db'
  import { scaleImageBeforeUpload } from '$lib/utils/imageCompression'

  /**
   * The size of the avatar image in em units
   *
   * @type {number}
   */
  export let size = 10

  /**
   * The URL of the uploaded avatar image
   *
   * @type {string | null}
   */
  export let url: string | null = null

  let avatarUrl: string | null = null
  let uploading = false
  let files: FileList

  const dispatch = createEventDispatcher()

  /**
   * Downloads the avatar image from the specified path
   *
   * @param {string} path - The path to the avatar image
   * @returns {Promise<void>}
   */
  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabaseClient.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const url = URL.createObjectURL(data)
      avatarUrl = url
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  /**
   * Uploads the selected avatar image
   *
   * @returns {Promise<void>}
   */
  const uploadAvatar = async () => {
    try {
      uploading = true

      // Ensure a file has been selected
      if (!files || files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      // Generate a unique file path
      const file = files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      // Scale the selected image to the specified dimensions
      const dimensions = { width: 200, height: 200 }
      let scaledImage = await scaleImageBeforeUpload(file, dimensions)

      // Check if the file type is invalid
      if (!scaledImage) {
        throw new Error('Invalid file type.')
      }

      // Upload the scaled image
      let { error } = await supabaseClient.storage.from('avatars').upload(filePath, scaledImage)

      if (error) {
        throw error
      }

      url = filePath
      dispatch('upload')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      uploading = false
    }
  }

  $: if (url) downloadImage(url)
</script>

<div>
  {#if avatarUrl}
    <img
      src={avatarUrl}
      alt={avatarUrl ? 'Avatar' : 'No image'}
      class="avatar image"
      style="height: {size}em; width: {size}em;"
    />
  {:else}
    <div class="avatar no-image" style="height: {size}em; width: {size}em;" />
  {/if}

  <div style="width: {size}em;">
    <label class="button primary block" for="single">
      {uploading ? 'Uploading ...' : 'Upload'}
    </label>
    <input
      style="visibility: hidden; position:absolute;"
      type="file"
      id="single"
      accept="image/*"
      bind:files
      on:change={uploadAvatar}
      disabled={uploading}
    />
  </div>
</div>
