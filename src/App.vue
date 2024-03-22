<script setup lang="ts">
import APIHandler from './scripts/APIHandler';
const api = APIHandler.getInstance();

/* get all products */
console.log(await api.getDocuments('product')) 

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

</script>

<template>
  <div>
    
  </div>
</template>

<style scoped>

</style>
