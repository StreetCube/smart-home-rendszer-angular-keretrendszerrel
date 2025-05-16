import { Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';
import { ProductService } from '../../../products/services/product.service';
import { ProductForRoom } from '../../../products/types/Product';

@Component({
  selector: 'app-room',
  imports: [ProductCardComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent implements OnInit, OnDestroy {
  public roomId = input.required<string>();
  private productService = inject(ProductService);
  public selectedRoomData!: ProductForRoom[] | null;

  // Custom signal for manual/periodic refresh
  private refreshSignal = signal(0);
  private refreshSub?: Subscription;

  constructor() {
    effect(() => {
      this.productService.getProductsForRoom(this.roomId()).subscribe((res) => {
        if (res && (res.data || res.data === null)) {
          this.selectedRoomData = res.data;
        } else {
          console.error('Error fetching room data:', res);
        }
      });
      this.refreshSignal();
    });
  }

  triggerRefresh() {
    this.refreshSignal.update((v) => v + 1);
  }

  ngOnInit(): void {
    this.refreshSub = interval(15000).subscribe(() => this.triggerRefresh());
  }

  ngOnDestroy() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }
}
