<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import APIHandler from '../scripts/APIHandler';
const api = APIHandler.getInstance();

const products:Ref<Array<any>> = ref([]);

async function getProducts(query_string :string = "") {
  let products_raw = await api.getProductsWithShops(query_string);
  products.value = products_raw.map((pro:any) => {
    pro.showDetails = false;
    return pro
  })
  
}
getProducts();

function showDetails(index: number) {
  if (products.value[index].showDetails) {
    products.value[index].showDetails = false;
  } else {
    products.value.forEach((product, index) => {
      products.value[index].showDetails = false;
    });
    products.value[index].showDetails = true;
  }
  
}

</script>

<template>
  <div class="custom-font row custom-bg-darkly my-4" v-for="(product, index) in products">
    <div class="col-9 fs-1 my-auto"><div>{{ product.displayName }}</div></div>
    <div @click="showDetails(index)" class="col-2"><img src="../assets/arrow-drop-down.png" /></div>
    <div v-if="product.showDetails" class="col-12 container mb-4">
      <div class="fw-bold row mb-1 mt-2">
        <div class="col-7">Shop</div>
        <div class="col-2">Price</div>
        <div class="col-3">Distance</div>
      </div>
      <div class="row" v-for="position in product.positions">
        <div class="col-7">{{ position.shop.name }}</div>
        <div class="col-2">2.50€</div>
        <div class="col-3">14.6 KM</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-font {
  font-family: patricksc;
}
</style>