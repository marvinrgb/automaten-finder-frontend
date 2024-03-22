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

  async getNearbyPositions(product_id: string, coordinates: {latitude:number,longitude:number}, radius?: number) {
    let response:AxiosResponse | undefined = undefined;
    let path:string = `/api/nearby/positions?product_id=${product_id}&longitude=${coordinates.longitude}&latitude=${coordinates.latitude}`;
    if (radius) {
      path += `&radius=${radius}`;
    }
    try {
      response = await axios.get(URL + path, this.getAxiosOptions());
      if (!response) throw responseEmpty;
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getNearbyShops(coordinates: {latitude:number,longitude:number}, radius?: number) {
    let response:AxiosResponse | undefined = undefined;
    let path:string = `/api/nearby/shops?longitude=${coordinates.longitude}&latitude=${coordinates.latitude}`;
    if (radius) {
      path += `&radius=${radius}`;
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
