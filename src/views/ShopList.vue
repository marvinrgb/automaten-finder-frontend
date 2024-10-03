<script setup lang="ts">
import { Ref, ref, watchEffect } from 'vue';
import APIHandler from '../scripts/APIHandler';


const api = APIHandler.getInstance();
/* get all products */
const allShops:Ref<Array<any>> = ref([]);
const shops:Ref<Array<any>> = ref([]);

async function getShops(text?: string) {
  // shops.value = await api.getDocuments('shop');
  allShops.value = await api.getNearbyShops({latitude: 50.65499403625568, longitude: 8.222678380315969}, 20000, text);
  allShops.value.sort((a:any,b:any) => a.distance < b.distance ? -1 : 1);
  filterShops();
}
getShops();

function updateTextQuery(text: string) {
  getShops(text);
}


function filterShops() {
  if (tags.length > 0) {
    shops.value = [];
    allShops.value.forEach((shop) => {
      for (const tag of tags.map((t) => {if (t.selected) {return {"id":t.id}}}).filter(t => t !== undefined)) {
        if (shop.activeTags.map((t:{id:string,selected:boolean}) => t.id).includes(tag!.id)) {
          shops.value.push(shop);
        }
      }
    })
  } else {
    shops.value = allShops.value;
  }
}

let tags:Array<any> = [];

function updateTags(currentTags:Array<any>) {
  tags = JSON.parse(JSON.stringify(currentTags));
  if (!(tags.find((t) => t.selected == true))) {
    tags = tags.map((t) => {
      t.selected = true;
      return t;
    })
  }
  console.log(tags);
  filterShops();
}

defineExpose({
  updateTags,
  updateTextQuery
})
</script>

<template>
  <div class="container-fluid pt-4">
    <!-- <div class="container" > -->
      <router-link :to="`/map/${shop.id}`" class="custom-font custom-bg-darkly py-2 px-2 row mx-auto mb-4 rounded" v-for="shop in shops">
        <div class="col-9 overflow-x-hidden custom-font fs-3">{{ shop.name }}</div>
        <div class="col-3 d-flex">
          <img class="my-auto custom-ar w-50"  src="../../public/pin_drop.png" />
          <div class="my-auto text-nowrap" >{{ Math.round(shop.distance / 100) / 10 }} KM</div>
        </div>
      </router-link>
    <!-- </div> -->
  </div>
</template>

<style scoped>
.custom-ar {
  aspect-ratio: 1/1.2;
}
.custom-bg-darkly {
  background-color: #4A4242;
}
</style>