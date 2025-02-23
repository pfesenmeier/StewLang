<template>
  <div id="container">
    <div id="buttons">
      <div class="button">Edit</div>
      <div class="button">Compose</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style >
#container {
  display: flex;
  justify-content: center;
  padding: 0.2rem;
}

#buttons {
  display: flex;
  gap: 1em;
  justify-content: center;
  border: solid;
  border-radius: 0.5rem;

  &> :not(:last-child) {
    border-inline-start-width: 0px;
    border-inline-end: 0.2rem solid;
  }
}


.button {
  padding: 0.2rem;
}
</style>
