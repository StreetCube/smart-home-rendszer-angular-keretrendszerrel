import { Component, effect, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProductCapabilityFull, ProductForRoom } from '../../types/Product';

import { NgClass } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, switchMap } from 'rxjs';
import { Zigbee2mqttTranslatePipe } from '../../../../shared/pipe/zigbee2mqtt-translate.pipe';
import { LanguageService } from '../../../translation/services/language.service';
import { ProductService } from '../../services/product.service';
import { CustomMatSlideToggleComponent } from '../custom-mat-slide-toggle/custom-mat-slide-toggle.component';
import { CustomNumericComponent } from '../custom-numeric/custom-numeric.component';

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
    Zigbee2mqttTranslatePipe,
    TranslatePipe,
    CustomMatSlideToggleComponent,
    CustomNumericComponent,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  public product = input.required<ProductForRoom>();
  private productService = inject(ProductService);
  private sendingCommand = false;
  public linkQuality?: number | null = -1;
  public languageService = inject(LanguageService);

  private selectChange$ = new Subject<{ event: any; cap: ProductCapabilityFull }>();

  constructor() {
    effect(() => {
      this.linkQuality = this.product().SupportedProduct.ProductCapabilities.find(
        (capability) => capability.property === 'linkquality'
      )?.deviceState.numericValue;
    });

    this.selectChange$
      .pipe(
        switchMap(({ event, cap }) =>
          this.productService.sendCommandToDevice(this.product().ieeeAddress, cap.property, event)
        )
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  onValueChange(event: any, cap: ProductCapabilityFull) {
    this.selectChange$.next({ event, cap });
  }
}
