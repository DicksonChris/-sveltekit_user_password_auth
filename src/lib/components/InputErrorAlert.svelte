<script lang="ts">
  import { faWarning } from '@fortawesome/free-solid-svg-icons'
  import Fa from 'svelte-fa'

  export let formErrorName: string
  export let formErrorData: string | undefined
</script>

{#if !formErrorData}
<!-- Empty div with min height of 1.25rem -->
<div class="h-5"></div>

{/if}
<label for={formErrorName} class="mt-2 h-14 {formErrorData ? '' : 'hidden'}">
  {#if formErrorData}
    <div class="alert alert-error h-10 rounded-lg">
      <div>
        <Fa icon={faWarning} /><span class="">{formErrorData}</span>
      </div>
    </div>
  {/if}
</label>
