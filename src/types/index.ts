export interface Product {
  id: string,
  productNumber: string;
  productName: string;
  order: number;
  isHem: boolean;
}

export interface Sku {
  id: string,
  parentId: string,
  size: string;
  price: number;
  stock: number;
  parentRef: any;
  order: number;
}

export interface item {

}