import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription, switchMap } from 'rxjs';
import { DynamicFormDialogComponent } from '../../../../shared/components/create-dialog/create-dialog.component';
import { DeleteProductConfirmationDialogComponent } from '../../../../shared/components/delete-product-confirmation-dialog/delete-product-confirmation-dialog.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { CreateDialogConstants } from '../../../../shared/constants/create-dialog.constants';
import { TableColumnConstants } from '../../../../shared/constants/table-column.constants';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { ApiCustomCode } from '../../../../shared/types/generalHttpResponse';
import { RoomService } from '../../../rooms/services/room.service';
import { Room } from '../../../rooms/types/Room';
import { ProductService } from '../../services/product.service';
import { Product_For_Create, Product_GetAllResponse, ProductAfterUpdate } from '../../types/Product';

@Component({
  selector: 'app-products',
  imports: [MatButtonModule, MatDialogModule, TranslatePipe, TableComponent, MatProgressSpinnerModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product_GetAllResponse[] = [];
  rooms: Room[] = [];
  columns = TableColumnConstants.COLUMNS['PRODUCT'];
  inclusionInProgress = false;

  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private roomService = inject(RoomService);
  private snackBarService = inject(SnackbarService);
  private snackbarService = inject(SnackbarService);
  public selectOptionsOnUpdate: { value: string; label: string }[] = [];
  private error = '';

  private roomsSub?: Subscription;
  private productsSub?: Subscription;

  constructor() {
    effect(() => {
      this.inclusionInProgress = this.productService.inclusionInProgress();
    });
  }
  ngOnInit(): void {
    this.fetchRoomsData();
    this.fetchProductsData();
  }

  ngOnDestroy(): void {
    this.roomsSub?.unsubscribe();
    this.productsSub?.unsubscribe();
  }

  private fetchRoomsData(): void {
    this.roomsSub = this.roomService.dataChanged
      .pipe(switchMap(() => this.roomService.getAll()))
      .subscribe((response) => {
        if (response && response.data) {
          this.rooms = response.data;
          this.selectOptionsOnUpdate = this.rooms.map((room) => ({
            value: room.id,
            label: room.name,
          }));
        } else {
          console.error('Error fetching rooms data:', response);
        }
      });
  }

  private fetchProductsData(): void {
    this.productsSub = this.productService.dataChanged
      .pipe(switchMap(() => this.productService.getAll<Product_GetAllResponse>()))
      .subscribe((response) => {
        if (response && response.data) {
          this.products = response.data;
        } else {
          console.error('Error fetching products data:', response);
        }
      });
  }

  openCreateDialog(): void {
    const dialog = this.dialog.open(DynamicFormDialogComponent, {
      data: CreateDialogConstants.CREATE_PRODUCT(this.selectOptionsOnUpdate),
    });
    dialog.afterClosed().subscribe((result: Product_For_Create) => {
      if (result) {
        this.productService.inclusionInProgress.set(true);
        this.productService.include(result).subscribe((response) => {
          this.productService.inclusionInProgress.set(false);
          if (response && response.data) {
            this.products.push(response.data);
          } else {
            switch (response.error.code) {
              case ApiCustomCode.ALREADY_EXISTS:
                this.snackbarService.showError('errors.product_already_exists');
                break;

              default:
                this.snackbarService.showError('errors.product_default_error');
                break;
            }
          }
        });
      }
    });
  }

  stopInclusion(): void {
    this.productService.stopInclusion();
  }

  updateProduct(data: any) {
    this.productService.update<ProductAfterUpdate>(data).subscribe((response) => {
      if (response && response.data) {
        this.snackBarService.showSuccess('update.product.success');
      } else {
        switch (response.error.code) {
          case ApiCustomCode.ALREADY_EXISTS:
            this.snackBarService.showError('update.product.already_exists');
            break;
          default:
            this.snackBarService.showError('update.product.unknown_error');
            break;
        }
      }
    });
  }

  deleteProduct(data: any) {
    const dialog = this.dialog
      .open(DeleteProductConfirmationDialogComponent, {
        data: { title: 'delete.product.title', text: 'delete.product.text' },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'yes') {
          this.productService.delete(data.id).subscribe((response) => {
            if (response && response.data) {
              this.snackBarService.showSuccess('delete.product.success');
            } else {
              switch (response.error.code) {
                default:
                  this.snackBarService.showError('delete.product.error');
                  break;
              }
            }
          });
        }
      });
  }
}
