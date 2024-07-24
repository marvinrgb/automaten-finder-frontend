<script setup lang="ts">
import MapView from './components/MapView.vue';
import ShopList from './components/ShopList.vue';
import { Ref, onMounted, ref } from 'vue';
import APIHandler from './scripts/APIHandler';
const api = APIHandler.getInstance();


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


const navButtons:Ref<Array<{img:string,link:'shopslist'|'shopsmap'|'productslist'}>> = ref([{img:'/src/assets/list.png',link:'shopslist'}, {img:'/src/assets/map.png',link:'shopsmap'}, {img:'/src/assets/category.png',link:'productslist'}])

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
      <ShopList v-if="currentPage == 'shopslist'" />
      <MapView v-if="currentPage == 'shopsmap'" />
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
@font-face {
    font-family: patricksc;
    src: url('./assets/fonts/PatrickHandSC-Regular.ttf');
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
