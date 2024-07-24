<script setup lang="ts">
import { Ref, ref } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import APIHandler from '../scripts/APIHandler';

const api = APIHandler.getInstance();
const shops:Ref<Array<any>> = ref([]);
async function getShops() {
  shops.value = await api.getDocuments('shop');
}
getShops();

async function selectShopOnMap(id: number) {
  await getShopPositions(id);
  selectedShopData.value.shop = shops.value.find((shop) => shop.id == id);
  console.log(selectedShopData.value);
}
const selectedShopData:Ref<{shop:{name:string,distance:number,longitude:number,latitude:number},positions:Array<any>,}> = ref({shop:{name:"", distance: 0, longitude: 0, latitude: 0}, positions:[]});
async function getShopPositions(id:number) {
  selectedShopData.value.positions = await api.getPositionsByShop(id);
}

const mapData:Ref<{zoom:number,latitude:number,longitude:number}> = ref({
  latitude: 8.221694278926318,
  longitude: 50.65461526749412,
  zoom: 12
})

function openNavigation() {
  open(`https://www.google.com/maps/place/${selectedShopData.value.shop.longitude},${selectedShopData.value.shop.latitude}`);
}
</script>

<template>
  <div class="row pt-4" style="height: 30vh;">
    <l-map class="rounded" ref="map" v-model:zoom="mapData.zoom" :center="[mapData.longitude, mapData.latitude]" :use-global-leaflet="false">
      <l-tile-layer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker @click="selectShopOnMap(shop.id)" v-for="shop in shops" :lat-lng="[shop.longitude, shop.latitude]">
        <l-popup class="pointer">{{ shop.name }}</l-popup>
      </l-marker>
    </l-map>
  </div>
  <div v-if="selectedShopData.shop.name != ''" class="row">
    <div class="col-12 text-center fs-1 my-3">{{ selectedShopData.shop.name }}</div>
    <div class="col-1"></div>
    <div class="col-10 d-flex align-items-center fs-5">
      <img width="16%" class="me-2 img-fluid" src="../assets/route.png" />
      <div class="text-nowrap me-4">{{ selectedShopData.shop.distance }} km</div>
      <button @click="openNavigation" type="button" class="btn btn-secondary">Navigation Starten</button>
    </div>
    <div class="col-1"></div>
    <div class="col-12 container mb-2 mt-4">
      <div class="row fs-5 fw-bold">
        <div class="col-6">Product</div>
        <div class="col-4"></div>
        <div class="col-2">Preis</div>
      </div>
    </div>
    <div class="col-12 container">
      <div class="row fs-5" v-for="position in selectedShopData.positions">
        <div class="col-6">{{ position.product.displayName }}</div>
        <div class="col-4"></div>
        <div class="col-2">{{ position.price }}€</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>