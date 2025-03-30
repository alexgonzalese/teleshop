import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';

const BASEURL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  getProducts(Options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = Options;

    return this.http
      .get<ProductsResponse>(`${BASEURL}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(tap((resp) => console.log(resp)));
  }
  getProductById(idSlug: string): Observable<Product> {
    return this.http.get<Product>(`${BASEURL}/products/${idSlug}`);
  }
}
