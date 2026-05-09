export interface OrderData {
  productName: string;
  productPrice: string;
  productCategory: string;
  productDescription: string;
  productImage: string;
  productAlt: string;
  payment: string;
  shipment: string;
  seller: string;
}

export interface User {
  name: string;
  seller: string;
  location?: string;
}
