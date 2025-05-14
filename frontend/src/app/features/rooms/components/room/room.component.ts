import { Component, effect, inject, input, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';
import { ProductService } from '../../../products/services/product.service';
import { ProductForRoom } from '../../../products/types/Product';

@Component({
  selector: 'app-room',
  imports: [ProductCardComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit {
  public roomId = input.required<string>();
  private productService = inject(ProductService);
  public selectedRoomData!: ProductForRoom[] | null;

  constructor() {
    effect(() => {
      this.productService.getProductsForRoom(this.roomId()).subscribe((res) => {
        if (res && (res.data || res.data === null)) {
          this.selectedRoomData = res.data;
        } else {
          console.error('Error fetching room data:', res);
        }
      });
    });
  }

  ngOnInit(): void {}
}
