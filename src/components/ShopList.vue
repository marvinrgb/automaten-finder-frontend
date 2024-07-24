<script setup lang="ts">
import { Ref, ref } from 'vue';
import APIHandler from '../scripts/APIHandler';

const api = APIHandler.getInstance();
/* get all products */
const shops:Ref<Array<any>> = ref([]);
async function getShops() {
  shops.value = await api.getDocuments('shop');
}
getShops();
  
</script>

<template>
  <div class="mt-4 row">
    <div class="container" >
      <div class="custom-bg-darkly py-2 px-2 row mx-auto mb-4 rounded" v-for="shop in shops">
        <div class="col-9 overflow-x-hidden custom-font fs-3">{{ shop.name }}</div>
        <div class="col-3 d-flex">
          <img class="my-auto custom-ar" width="50%"  src="../assets/pin_drop.png" />
          <div class="my-auto text-nowrap" >3.4 KM</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-font {
  font-family: patricksc;
}
.custom-ar {
  aspect-ratio: 1/1.2;
}
.custom-bg-darkly {
  background-color: #4A4242;
}
</style>