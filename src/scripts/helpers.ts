import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return (Math.floor(d * 1000 * 100) / 100); // meters
}

async function getCities(text: string) {
  const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${text}&country=de`);
  return response.data;
}

export { calculateDistance }