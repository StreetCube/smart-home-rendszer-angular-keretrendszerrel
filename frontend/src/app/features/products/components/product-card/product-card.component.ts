import { Component, effect, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProductForRoom } from '../../types/Product';

import { NgClass } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-card',
  imports: [
    MatCardModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    NgClass,
    MatIconModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  public product = input.required<ProductForRoom>();
  public linkQuality?: number | null = -1;

  constructor() {
    effect(() => {
      this.linkQuality = this.product().SupportedProduct.ProductCapabilities.find(
        (capability) => capability.property === 'linkquality'
      )?.deviceState.numericValue;
    });
  }
}
