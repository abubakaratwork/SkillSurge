import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalProductService } from '../../core/services/localproduct.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/interfaces/Product';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent {
  constructor(private route: ActivatedRoute, private localProdService: LocalProductService) { }

  product: Product = {
    id: '0000000-0000-0000-0000-0000000000000',
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: '',
    userId: '',
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.product = this.localProdService.getById(id ?? "") ?? this.product;
  }
}
