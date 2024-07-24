<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import APIHandler from './scripts/APIHandler';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
const api = APIHandler.getInstance();

/* get all products */
const shops:Ref<Array<any>> = ref([]);
async function getShops() {
  shops.value = await api.getDocuments('shop');
}
getShops();

/* get all products with filterOptions, can use any property to filter and can use multiple */
// console.log(await api.getDocuments('product', {displayName: 'Aprikose'}))

/*
nach positionen suchen, wird nur mit shop_id wichtig sein, 
da es bisher keinen usecase für alle positionen gibt und diese potential viele werden
*/
// console.log(await api.getDocuments('position', {shop_id:''}))

/*
kann natürlich zusätlich nach product_id filtern 
(auch preis wäre möglich, aber es ist bisher kein größer,kleiner implementiert, nur gleich)
*/
// console.log(await api.getDocuments('position', {shop_id:'', product_id:''}))

/*
holst alle shops, filterbar nach name
*/
// console.log(await api.getDocuments('shop'))

/*
Sucht shops im umkreis. Umkreis entweder in metern mitschicken oder es wird der api default genutzt
*/
// console.log(await api.getNearbyShops({latitude:50.680146,longitude:8.314625}, 9000));

/*
Sucht Positionen im Umkreis, also Shops, die ein bestimmtes produkt verkaufen
*/
// console.log(await api.getNearbyPositions('QIKGQo4BQEV5MsAIWcLz', {latitude:50.680146,longitude:8.314625}, 9000))

const tags:Ref<Array<{name:string,selected:boolean}>> = ref([
  { name: "Vapes", selected: false },
  { name: "Energy", selected: false },
  { name: "Snacks", selected: false },
  { name: "Shisha-Zubehör", selected: false },
  { name: "Alkohol", selected: false }
]
);
const showFiltertool:Ref<boolean> = ref(false);

const currentPage:Ref<'shopslist'|'shopsmap'|'productslist'> = ref('shopsmap');

const mapData:Ref<{zoom:number,latitude:number,longitude:number}> = ref({
  latitude: 8.221694278926318,
  longitude: 50.65461526749412,
  zoom: 12
})

const navButtons:Ref<Array<{img:string,link:'shopslist'|'shopsmap'|'productslist'}>> = ref([{img:'/src/assets/list.png',link:'shopslist'}, {img:'/src/assets/map.png',link:'shopsmap'}, {img:'/src/assets/category.png',link:'productslist'}])

const selectedShopData:Ref<{shop:{name:string,distance:number,longitude:number,latitude:number},positions:Array<any>,}> = ref({shop:{name:"", distance: 0, longitude: 0, latitude: 0}, positions:[]});
async function getShopPositions(id:number) {
  selectedShopData.value.positions = await api.getPositionsByShop(id);
}

async function selectShopOnMap(id: number) {
  await getShopPositions(id);
  selectedShopData.value.shop = shops.value.find((shop) => shop.id == id);
  console.log(selectedShopData.value);
}

function openGeoApp() {
  // open(`geo:${selectedShopData.value.shop.longitude},${selectedShopData.value.shop.latitude}`);
}

</script>

<template>
  <div class="container-fluid text-light bg-dark min-vh-100 vw-100">
    <div class="container py-3 px-4 mh-100">
      <div class="custom-bottom-light-border">
        <div class="fs-1 py-3 text-center bg-dark text-light">Automatenfinder</div>
      </div>
      <div class="row">
        <div class="text-center col-3 my-auto">Filtertool</div>
        <div @click="showFiltertool = !showFiltertool" class="py-1 col-2 d-flex justify-content-center">
          <img class="pointer img-fluid" src="./assets/arrow-drop-down.png" />
        </div>
        <div class="col-1"></div>
        <div class="col-5 my-auto">
          <input placeholder="Search" class="rounded-pill bg-secondary text-light px-1 py-1" type="text" />
        </div>
      </div>
      <div v-if="showFiltertool" class="row">
        <div class="rounded container mx-auto bg-secondary w-75">
          <div class="row row-cols-auto p-3 pb-4">
            <div v-for="(tag, index) in tags" @click="tags[index].selected = !tags[index].selected" :class="`${(tag.selected) ? 'custom-tag-on' : 'custom-tag-off'} pointer col py-2 px-4 m-1 rounded-pill text-dark`">{{ tag.name }}</div>
          </div>
        </div>
      </div>
      <div v-if="currentPage == 'shopslist'" class="mt-4 row"> <!-- shops list -->
        <div class="container" >
          <div class="custom-bg-darkly py-2 px-2 row mx-auto mb-4 rounded" v-for="shop in shops">
            <div class="col-9 overflow-x-hidden custom-font fs-3">{{ shop.name }}</div>
            <div class="col-3 d-flex">
              <img class="my-auto custom-ar" width="50%"  src="./assets/pin_drop.png" />
              <div class="my-auto text-nowrap" >3.4 KM</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row pt-4" style="height: 30vh;" v-if="currentPage == 'shopsmap'">
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
      <div v-if="currentPage == 'shopsmap' && selectedShopData.shop.name != ''" class="row">
        <div class="col-12 text-center fs-1 my-3">{{ selectedShopData.shop.name }}</div>
        <div class="col-1"></div>
        <div class="col-10 d-flex align-items-center fs-5">
          <img width="16%" class="me-2 img-fluid" src="./assets/route.png" />
          <div class="text-nowrap me-4">{{ selectedShopData.shop.distance }} km</div>
          <button @click="openGeoApp" type="button" class="btn btn-secondary">Navigation Starten</button>
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
    </div>
    <div class="fixed-bottom container custom-top-border">
      <div class="row">
        <div class="col-4" v-for="button in navButtons">
          <img @click="currentPage = button.link" class="pointer d-block mx-auto my-3" width="35%" :src="button.img" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
input {
  border: 0;
  outline: 0;
}
input:focus {
  outline: none !important;
}
.custom-top-border {
  border-top: 1px solid rgb(127, 127, 127);
}
.custom-ar {
  aspect-ratio: 1/1.2;
}
@font-face {
    font-family: patricksc;
    src: url('./assets/fonts/PatrickHandSC-Regular.ttf');
}
.custom-font {
  font-family: patricksc;
}
.custom-bg-darkly {
  background-color: #4A4242;
}
.custom-tag-on {
  background-color: #D9D9D9;
}
.custom-tag-off {
  background-color: rgba(217, 217, 217, 0.4);
}
* {
  box-sizing: border-box;
}
.custom-bottom-light-border {
  border-bottom: 1px solid rgb(109, 109, 109);
}
</style>
