import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

const BASEURL = environment.baseUrl;

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    if (typeof value === 'string') {
      return `${BASEURL}/files/product/${value}`;
    }

    const image = value.at(0);

    if (!image) {
      return '../../../../public/assets/images/product/no-image.png';
    }

    return `${BASEURL}/files/product/${image}`;
  }
}
