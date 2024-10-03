<script setup lang="ts">
import * as bootstrap from 'bootstrap'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import MapView from './views/MapView.vue';
import ShopList from './views/ShopList.vue';
import ErrorModal from './components/ErrorModal.vue';
import { Ref, onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import APIHandler from './scripts/APIHandler';
const api = APIHandler.getInstance();

const tags:Ref<Array<{name:string,selected:boolean}>> = ref([]);

async function getTags() {
  let tags_raw:Array<any> = await api.getDocuments('tag')
  // console.log(tags_raw)
  tags.value = tags_raw.map((tag) => {
    tag.selected = false;
    return tag
  });
}
getTags();

const filtertoolOpen:Ref<boolean> = ref(false);



const pathObject:Ref<any> = ref();
watchEffect(() => {
  pathObject.value = router.currentRoute.value;
});


const shopListComponent:Ref<any> = ref(null);
function checkTag(tagIndex: number) {
  tags.value[tagIndex].selected = !tags.value[tagIndex].selected
  shopListComponent.value.updateTags(tags.value);
}

const text_field:Ref<string> = ref("");
function startQueryWithText() {
  const text_field_old = structuredClone(text_field.value);
  setTimeout(() => {
    if (text_field_old == text_field.value)
    shopListComponent.value.updateTextQuery(text_field.value);
  }, 500); // how much interval between key taps for a request to happen
}

const radius_slider_value:Ref<number> = ref(10);
const radius_slider_value_old:Ref<number> = ref(10);
const location_switch_value:Ref<boolean> = ref(true);
// location_switch_value.value = false;
function switchLocationSource() {
  console.log(location_switch_value.value)
  if (location_switch_value.value == true) {
    if (location_data.value.gps_location.latitude == 0) {
      displayError("Could not retrieve location data. Refresh and grant location permission or select location manually.");
    } else {
      api.setCoordinates(location_data.value.gps_location.latitude, location_data.value.gps_location.longitude);
    }
  } else {
    // console.log("setting coordinates in apihandler");
    api.setCoordinates(location_data.value.custom_location.latitude, location_data.value.custom_location.longitude);
  }
  startQueryWithText();
}

function updateRadius() {
  radius_slider_value_old.value = radius_slider_value.value;
  setTimeout(() => {
    if (radius_slider_value.value == radius_slider_value_old.value) {
      api.setRadius(radius_slider_value.value);
      shopListComponent.value.updateTextQuery(text_field.value);
    }
  }, 1000);
}

const city_input_value:Ref<string> = ref("");
const cities_available:Ref<Array<any>> = ref([]);

async function getCities() {
  cities_available.value = (await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${city_input_value.value}&country=de`, {
    headers: {
      "X-Api-Key": "C6D11Y5uE7KqSYsPjej8yA==no2F3PjxUlNLhiFD"
    }
  })).data;
  console.log(cities_available.value);
}

function setCityCoordinates(index: number) {
  location_data.value.custom_location.latitude = cities_available.value[index].latitude;
  location_data.value.custom_location.longitude = cities_available.value[index].longitude;
  location_data.value.custom_location.name = cities_available.value[index].name;
  console.log(location_data.value)
  switchLocationSource();
}

const location_data:Ref<{custom_location:{name:string,latitude:number,longitude:number},gps_location:{latitude:number,longitude:number}}> = ref({
  custom_location: {
    name: "",
    latitude: 0,
    longitude: 0
  },
  gps_location: {
    latitude: 0,
    longitude: 0
  }
})

async function setGPSLocation() {
  navigator.geolocation.getCurrentPosition((pos) => {
    location_data.value.gps_location.latitude = pos.coords.latitude;
    location_data.value.gps_location.longitude = pos.coords.longitude;
    // location_switch_value.value = true;
    switchLocationSource();
    location_switch_value.value = false;
    // console.log(location_data.value.gps_location)
    return true;
  }, (err) => {
    displayError("Could not retrieve location data. Refresh and grant location permission or select location manually.");
    location_switch_value.value = true;
    // switchLocationSource();
  })
}
setGPSLocation();

const errorMessage:Ref<string> = ref("");
function displayError(text: string) {
  errorMessage.value = text;
  let errorModal = new bootstrap.Modal(document.getElementById('error-modal') as Element, {});
  errorModal.show();
}

</script>

<template>
    <ErrorModal :text="errorMessage" />

    <!-- Modal for selecting location manually -->
    <div class="modal fade" id="city-select" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content pb-3 w-75 mx-auto mt-5 bg-dark text-light">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Select City</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <input @change="getCities" v-model="city_input_value" placeholder="Type Berlin" type="text" class="bg-secondary text-light mb-4 form-control"/>
            <div class="d-flex py-2 px-2" v-for="(city, index) in cities_available">
              <div class="w-75">
                <div class="fs-4">{{ city.name }}</div>
                <div>{{ city.state }}</div>
              </div>
              <div @click="setCityCoordinates(index)" data-bs-dismiss="modal" class="btn btn-secondary my-auto">Select</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-3 px-4 text-light bg-dark mb-5">
      <div class="custom-bottom-light-border mb-3">
        <div class="fs-1 py-3 text-center bg-dark">Automatenfinder</div>
      </div>

      <!-- Location settings -->
      <div class="custom-bottom-light-border mb-3">
        <div class="d-flex mb-3">
          <div class="me-3">Radius: {{radius_slider_value%1==0?radius_slider_value + '.0':radius_slider_value}}Km</div>
          <input @change="updateRadius" v-model="radius_slider_value" type="range" min="1" max="100" step="0.1" />
        </div>
        <div class="d-flex mb-3">
          <div class="my-auto me-3">GPS</div>
          <div class="my-auto form-check form-switch me-2">
            <input @click="switchLocationSource" v-model="location_switch_value" type="checkbox" class="form-check-input" role="switch" id="flexSwitchCheckDefault">
          </div>
          <button type="button" data-bs-toggle="modal" data-bs-target="#city-select" class="btn btn-secondary">{{ location_data.custom_location.name != "" ? location_data.custom_location.name : 'Select Location'}}</button>
        </div>
      </div>

      <!-- Filtertool -->
      <div class="row d-flex">
        <div class="text-center col-3 my-auto opacity-50">Filtertool</div>
        <div @click="filtertoolOpen = !filtertoolOpen" class="py-1 col-2 d-flex justify-content-center">
          <img class="pointer img-fluid opacity-50" src="../public/arrow-drop-down.png" />
        </div>
        <div v-if="pathObject.path != '/map'" class="col-7 my-auto">
          <input @keyup="startQueryWithText" v-model="text_field" placeholder="Search" class="border border-secondary rounded-pill w-100 bg-brown-grey px-1 py-1 ps-2" type="text" />
        </div>
      </div>
      <div v-if="filtertoolOpen" class="row mt-2">
        <div class="rounded container mx-auto bg-brown-grey w-75">
          <div class="row row-cols-auto p-3 pb-4">
            <div v-for="(tag, index) in tags" @click="checkTag(index)" :class="`${(tag.selected) ? 'custom-tag-on text-dark' : 'custom-tag-off'} custom-font fs-2 pointer col py-1 px-4 m-1 rounded-pill`">
              {{ tag.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 row" v-else-if="!filtertoolOpen && tags.find((t) => t.selected == true)">
        <div class="col-auto border rounded-pill mx-1 px-3 py-1" v-for="t in tags.filter((t) => t.selected == true)">
          {{ t.name }}
          <!-- Hier noch ein remove image um die tags auch hier schnell zu entfernen -->
        </div>
      </div>
      <router-view v-slot="{ Component }" class="" >
        <component :is="Component" ref="shopListComponent" ></component>
      </router-view>
    </div>

    <div class="fixed-bottom container custom-top-border bg-dark">
      <div class="row ">
        <router-link :to="`/shops`" class="col-4">
          <img tag="img" :class="`pointer d-block mx-auto my-3 ${pathObject.path == '/shops' ? 'opacity-100' : 'opacity-50'}`" width="35%" src="../public/list.png" />
        </router-link>
        <router-link :to="`/map`" class="col-4">
          <img tag="img" :class="`pointer d-block mx-auto my-3 ${pathObject.path == '/map' ? 'opacity-100' : 'opacity-50'}`" width="35%" src="../public/map.png" />
        </router-link>
        <router-link :to="`/items`" class="col-4">
          <img tag="img" :class="`pointer d-block mx-auto my-3 ${pathObject.path == '/items' ? 'opacity-100' : 'opacity-50'}`" width="35%" src="../public/category.png" />
        </router-link>
      </div>
    </div>
</template>

<style scoped>
::placeholder {
  color: rgba(255, 255, 255, 0.5);
  opacity: 1; /* Firefox */
}

::-ms-input-placeholder { /* Edge 12 -18 */
  color: rgba(255, 255, 255, 0.5);
}

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
.custom-tag-on {
  background-color: #D9D9D9;
}
.custom-tag-off {
  background-color: #d9d9d955;
  color: rgba(255, 255, 255, 0.5);
}
* {
  box-sizing: border-box;
}
.custom-bottom-light-border {
  border-bottom: 1px solid rgb(109, 109, 109);
}
</style>
