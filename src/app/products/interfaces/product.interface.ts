import { User } from "@auth//interfaces/user.interfaces";

export interface ProductsResponse {
  count:    number;
  pages:    number;
  products: Product[];
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  gender: string;
  tags: string[];
  images: string[];
  user: User;
}




