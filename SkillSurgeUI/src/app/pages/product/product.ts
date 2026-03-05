import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalProductService, Product } from '../../core/services/localproduct.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent {
  constructor(private route: ActivatedRoute , private localProdService: LocalProductService) { }

  product : Product = {
    id: '0000000-0000-0000-0000-0000000000000',
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  ngOnInit() {
     const id = this.route.snapshot.paramMap.get('id');
     this.product = this.localProdService.getById(id ?? "") ?? this.product;
  }
}
