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
  border: solid 0.15rem;
  border-radius: 0.5rem;

  /* between border */ 
  &> :not(:last-child) {
    border-inline-start-width: 0px;
    border-inline-end: 0.15rem solid;
  }
}

.button {
  padding: 0.1rem 4rem; 
  width: 12rem;
  text-align: center;
}

</style>
