import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import * as types from './types';
const URL = import.meta.env.VITE_API_URI;
const responseEmpty = new Error("api response is undefined")

export default class APIHandler {
  static getInstance() {
    if (!APIHandler.instance) {
      APIHandler.instance = new APIHandler;
    }
    return APIHandler.instance;
  }
  static instance:APIHandler|null = null;

  private constructor() {}

  private getAxiosOptions():AxiosRequestConfig {
    // const store = useTokenStore();
    // const token = store.get;
    return {
      // headers: {
      //   'Authorization' :`Bearer ${ token }`
      // }
    }
  }

  private radius:number = 10000;
  private coordinates:{latitude:number,longitude:number} = {latitude:0,longitude:0};

  setCoordinates(latitude: number, longitude: number) {
    this.coordinates.latitude = latitude;
    this.coordinates.longitude = longitude;
  }

  setRadius(radius: number) { //comes in km
    this.radius = radius * 1000;
  }

  async getProductsWithShops(query_string: string) {
    let response:AxiosResponse | undefined = undefined;
    let path:string = `/api/nearby/itemswithshops/?query_string=${query_string}`;
    try {
      response = await axios.get(URL + path, this.getAxiosOptions());
      if (!response) throw responseEmpty;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPositionsByShop(shop_id: number) {
    let response:AxiosResponse | undefined = undefined;
    let path:string = `/api/documents/positionsbyshop?shop_id=${shop_id}`;
    try {
      response = await axios.get(URL + path, this.getAxiosOptions());
      if (!response) throw responseEmpty;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getNearbyPositions(product_id: string, coordinates: {latitude:number,longitude:number}, radius: number = 10000) {
    let response:AxiosResponse | undefined = undefined;
    let path:string = `/api/nearby/positions?product_id=${product_id}&longitude=${this.coordinates.longitude}&latitude=${this.coordinates.latitude}&radius=${this.radius}`;

    try {
      response = await axios.get(URL + path, this.getAxiosOptions());
      if (!response) throw responseEmpty;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getNearbyShops(coordinates: {latitude:number,longitude:number}, radius: number = 10000, text_query?: string) {
    let response:AxiosResponse | undefined = undefined;
    let path:string = `/api/nearby/shops?longitude=${this.coordinates.longitude}&latitude=${this.coordinates.latitude}&radius=${this.radius}`;
    if (text_query) {
      path += `&query_text=${text_query}`;
    }
    try {
      response = await axios.get(URL + path, this.getAxiosOptions());
      if (!response) throw responseEmpty;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDocuments(_type:types.databaseType, queryObject?:{[key:string]:string|number}, paginationOptions?:{from:number,size:number}):Promise<Array<any>> {
    let response:AxiosResponse | undefined = undefined;
    let path:string = `/api/documents?_type=${_type}`;
    if (queryObject) {
      for (const [key, value] of Object.entries(queryObject)) {
        path += `&${key}=${value}`;
      }
    }
    if (paginationOptions) {
      for (const [key, value] of Object.entries(paginationOptions)) {
        path += `&${key}=${value}`;
      }
    }
    try {
      response = await axios.get(URL + path, this.getAxiosOptions());
      if (!response) throw responseEmpty;
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
