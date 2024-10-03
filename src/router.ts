import { createWebHistory, createRouter } from "vue-router";
import MapView from "./views/MapView.vue";
import ShopList from "./views/ShopList.vue";
import ItemList from "./views/ItemList.vue";

const routes = [
  {
    path: "/",
    redirect: "/map"
  },
  {
    path: "/map",
    name: "Shop Map",
    component: MapView,
  },
  {
    path: "/map/:shopid",
    name: "Map with detailed Shop",
    component: MapView,
    props: true
  },
  {
    path: "/shops",
    name: "Shop List",
    component: ShopList,
    props: {default: true, sidebar: false}
  },
  {
    path: "/items",
    name: "Item List",
    component: ItemList,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;