<script setup lang="ts">
const props = defineProps(['text'])
</script>

<template>
  <div class="modal fade" id="error-modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content pb-3 w-75 mx-auto mt-5 bg-dark text-light">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Error</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          {{ text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>