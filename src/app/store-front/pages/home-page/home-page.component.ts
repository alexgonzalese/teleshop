import { Component, inject } from '@angular/core';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@store-front/pages/product-page/components/product-card/product-card.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/services/pagination.service';
//import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);


  // activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map((params) => (params.get('page') ? + params.get('page')! : 1)),
  //     map((page)=>(isNaN(page) ? 1 : page))
  //   ),
  //   { initialValue: 1 }
  // );

  productsResource = rxResource({
    request: () => ({page: this.paginationService.currentPage() - 1}),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9,
      });
    },
  });
}
