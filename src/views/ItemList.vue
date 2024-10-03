<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Ref, onMounted, ref } from 'vue';
import APIHandler from '../scripts/APIHandler';
import { calculateDistance } from '../scripts/helpers';
const api = APIHandler.getInstance();

const products:Ref<Array<any>> = ref([]);
const products_unfiltered:Ref<Array<any>> = ref([]);

async function getProducts(query_string :string = "") {
  let products_raw = await api.getProductsWithShops(query_string);
  products_unfiltered.value = products_raw.map((pro:any) => {
    pro.showDetails = false;
    return pro
  })
  console.log(products_unfiltered.value)
  products.value = products_unfiltered.value;
}
getProducts();
function updateTextQuery(text: string) {
  getProducts(text);
}
const userLocation:Ref<{latitude:number,longitude:number}> = ref({longitude: 8.221694278926318, latitude: 50.65461526749412});

function updateTags(currentTags:Array<any>) {
  console.log(currentTags)
  // if no tag selected products = products_unfiltered
  if (!currentTags.find((cTag) => cTag.selected)) {
    return products.value = products_unfiltered.value;
  }
  products.value = products_unfiltered.value.map((pro) => {
    if (currentTags.find((t) => t.id == pro.tag_id) && currentTags.find((t) => t.id == pro.tag_id).selected) {
      return pro;
    } else {
      return undefined;
    }
  })
  .filter((pro) => pro)
}

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

defineExpose({
  updateTags,
  updateTextQuery
})
</script>

<template>
  <div class="custom-font row custom-bg-darkly my-4" v-for="(product, index) in products" :style="`display: ${product.positions.length > 0 ? 'flex' : 'none'}`">
    <div class="col-2 fs-1 my-auto"><img class="img-fluid" :src="product.image"></img></div>
    <div class="col-7 fs-1 my-auto"><div>{{ product.displayName }}</div></div>
    <div @click="showDetails(index)" class="col-2"><img src="../../public/arrow-drop-down.png" /></div>
    <div v-if="product.showDetails" class="col-12 container mb-4">
      <div class="fw-bold row mb-1 mt-2">
        <div class="col-6">Shop</div>
        <div class="col-1">Price</div>
        <div class="col-2">Distance</div>
      </div>
      <div class="row" v-for="position in product.positions">
        <div class="col-6 ">{{ position.shop.name }}</div>
        <div class="col-1">{{ position.price }}€</div>
        <!-- <div class="col-2">{{ product.shop }} KM</div> -->
        <div class="col-2">{{ Math.round(calculateDistance(userLocation.latitude, userLocation.longitude, position.shop.latitude, position.shop.longitude) / 100 ) / 10 }} KM</div>
        <div class="col-2"><router-link :to="`/map/${position.shop.id}`" class="mb-2 btn btn-secondary"> > </router-link></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-font {
  font-family: patricksc;
}
</style>