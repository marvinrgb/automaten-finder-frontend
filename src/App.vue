<script setup lang="ts">
import MapView from './views/MapView.vue';
import ShopList from './views/ShopList.vue';
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

const t:Ref<Array<{name:string,selected:boolean}>> = ref([
  { name: "Vapes", selected: false },
  { name: "Energy", selected: false },
  { name: "Snacks", selected: false },
  { name: "Shisha-Zubehör", selected: false },
  { name: "Alkohol", selected: false }
]);

const tags:Ref<Array<{name:string,selected:boolean}>> = ref([]);

async function getTags() {
  let tags_raw:Array<any> = await api.getDocuments('tag')
  console.log(tags_raw)
  tags.value = tags_raw.map((tag) => {
    tag.selected = false;
    return tag
  });
}
getTags();

const showFiltertool:Ref<boolean> = ref(false);

const currentPage:Ref<'shopslist'|'shopsmap'|'productslist'> = ref('shopsmap');


const navButtons:Ref<Array<{img:string,link:'shops'|'map'|'items'}>> = ref([{img:'/src/assets/list.png',link:'shops'}, {img:'/src/assets/map.png',link:'map'}, {img:'/src/assets/category.png',link:'items'}])

</script>

<template>
  <!-- <div class="container-fluid text-light bg-dark"> -->
    <div class="container py-3 px-4 text-light bg-dark">
      <div class="custom-bottom-light-border mb-3">
        <div class="fs-1 py-3 text-center bg-dark">Automatenfinder</div>
      </div>
      <div class="row d-flex">
        <div class="text-center col-3 my-auto">Filtertool</div>
        <div @click="showFiltertool = !showFiltertool" class="py-1 col-2 d-flex justify-content-center">
          <img class="pointer img-fluid" src="./assets/arrow-drop-down.png" />
        </div>
        <div class="col-7 my-auto">
          <input placeholder="Search" class="rounded-pill w-100 bg-secondary px-1 py-1 ps-2" type="text" />
        </div>
      </div>
      <div v-if="showFiltertool" class="row mt-2">
        <div class="rounded container mx-auto bg-secondary w-75">
          <div class="row row-cols-auto p-3 pb-4">
            <div v-for="(tag, index) in tags" @click="tags[index].selected = !tags[index].selected" :class="`${(tag.selected) ? 'custom-tag-on' : 'custom-tag-off'} pointer col py-2 px-4 m-1 rounded-pill text-dark`">{{ tag.name }}</div>
          </div>
        </div>
      </div>
      <router-view />
    </div>

    <div class="fixed-bottom container custom-top-border bg-dark">
      <div class="row">
        <router-link :to="`/${button.link}`" class="col-4" v-for="button in navButtons">
          <img tag="img" class="pointer d-block mx-auto my-3" width="35%" :src="button.img" />
        </router-link>
      </div>
    </div>
  <!-- </div> -->
</template>

<style scoped>
::placeholder {
  color: white;
  opacity: 1; /* Firefox */
}

::-ms-input-placeholder { /* Edge 12 -18 */
  color: white;
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
  background-color: rgba(217, 217, 217, 0.4);
}
* {
  box-sizing: border-box;
}
.custom-bottom-light-border {
  border-bottom: 1px solid rgb(109, 109, 109);
}
</style>
