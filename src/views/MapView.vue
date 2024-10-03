<script setup lang="ts">
import { Ref, ref } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "@vue-leaflet/vue-leaflet";
import APIHandler from '../scripts/APIHandler';

const props = defineProps({
  shopid: String
});

const userLocation:Ref<{latitude:number,longitude:number}> = ref({longitude: 8.221694278926318, latitude: 50.65461526749412});

const api = APIHandler.getInstance();
const allShops:Ref<Array<any>> = ref([]);
const shops:Ref<Array<any>> = ref([]);

async function getShops() {
  allShops.value = await api.getNearbyShops({latitude: userLocation.value.latitude, longitude: userLocation.value.longitude}, 20000);
  if (props.shopid && !isNaN(Number(props.shopid))) {
    selectShopOnMap(Number(props.shopid));
  }
  console.log(allShops.value);
  shops.value = allShops.value;
  filterShopsByTags();
}
getShops();
function filterShopsByTags() {
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

async function selectShopOnMap(id: number) {
  await getShopPositions(id);
  selectedShopData.value.shop = shops.value.find((shop) => shop.id == id);
  mapData.value.latitude = selectedShopData.value.shop.latitude;
  mapData.value.longitude = selectedShopData.value.shop.longitude;
}
const selectedShopData:Ref<{shop:{name:string,distance:number,longitude:number,latitude:number},positions:Array<any>}> = ref({shop:{name:"", distance: 0, longitude: 0, latitude: 0}, positions:[]});
async function getShopPositions(id:number) {
  selectedShopData.value.positions = await api.getPositionsByShop(id);
}



const mapData:Ref<{zoom:number,latitude:number,longitude:number}> = ref({
  latitude: userLocation.value.latitude,
  longitude: userLocation.value.longitude,
  zoom: 12
})

function openNavigation() {
  open(`https://www.google.com/maps/place/${selectedShopData.value.shop.longitude},${selectedShopData.value.shop.latitude}`);
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
  filterShopsByTags();
}
function updateTextQuery(text: string) { //just proxies bc name has to be same in all components
  getShops(); 
  return;
}

defineExpose({
  updateTags,
  updateTextQuery
})
</script>

<template>
  <div class="row pt-4" style="height: 30vh;">
    <l-map class="rounded" ref="map" v-model:zoom="mapData.zoom" :center="[mapData.latitude, mapData.longitude]" :use-global-leaflet="false">
      <l-tile-layer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker @click="selectShopOnMap(shop.id)" v-for="shop in shops" :lat-lng="[shop.latitude, shop.longitude]">
        <l-popup class="pointer">{{ shop.name }}</l-popup>
      </l-marker>

      <l-marker :lat-lng="[userLocation.latitude, userLocation.longitude]">
        <l-tooltip class="pointer">Standort</l-tooltip>
      </l-marker>
    </l-map>
  </div>
  <div v-if="selectedShopData.shop.name != ''" class="row">
    <div class="col-12 text-center fs-1 my-3">{{ selectedShopData.shop.name }}</div>
    <div class="col-1"></div>
    <div class="col-10 d-flex align-items-center fs-5">
      <img width="16%" class="me-2 img-fluid" src="../../public/route.png" />
      <div class="text-nowrap me-4">{{ Math.round(selectedShopData.shop.distance / 10) / 100 }} km</div>
      <button @click="openNavigation" type="button" class="btn btn-secondary">Navigation Starten</button>
    </div>
    <div class="col-1"></div>
    <div v-if="selectedShopData.positions.length > 0" class="col-12 container mb-2 mt-4">
      <div class="row fs-5 fw-bold">
        <div class="col-6">Product</div>
        <div class="col-4"></div>
        <div class="col-2">Preis</div>
      </div>
    </div>
    <div v-if="selectedShopData.positions.length > 0" class="col-12 container">
      <div class="row fs-5 border-bottom border-secondary py-1" v-for="position in selectedShopData.positions">
        <div class="col-6">{{ position.product.displayName }}</div>
        <div class="col-4"></div>
        <div class="col-2">{{ position.price }}€</div>
      </div>
    </div>
    <div class="col-12 text-center mt-5" v-else>Das Angebot dieses Shops wurde noch nicht gepflegt</div>
  </div>
</template>

<style scoped>
</style>