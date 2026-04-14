export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
  seller: string;
  dateAdded: string;
  image: string;
  images: string[];
  alt: string;
  url: string;
}

export interface ProductsData {
  products: Product[];
}

export interface CarouselItem {
  id: string;
  name: string;
  alt: string;
  images: string[];
}

export interface IndexData {
  'image-loader': CarouselItem[];
  main_title: string;
}
