export type databaseType = 'product' | 'shop' | 'position';

export type Shop = {
  _type?: 'shop',
  id?: string,
  image: string,
  name: string,
  location: {
    coordinates: {
      longitude: number,
      latitude: number
    },
    adress?: {
      street: string,
      house_number: string
      postal_code: number,
      city: string,
      country: string
    }
  }
}

export type Product = {
  _type?: 'product',
  id?: string,
  displayName: string,
  images: Array<string>
}

export type Position = {
  _type?: 'position',
  id?: string,
  product_id: string,
  shop_id: string,
  price: number
}