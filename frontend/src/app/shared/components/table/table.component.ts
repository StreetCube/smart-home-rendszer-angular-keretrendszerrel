import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  Signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateDialogConstants } from '../../constants/create-dialog.constants';
import { NestedValuePipe } from '../../pipe/nested-value.pipe';
import { RowAction, TableColumn } from '../../types/table.types';
import { DynamicFormDialogComponent } from '../create-dialog/create-dialog.component';
import { CustomMatPaginatorIntl } from './custom-mat-paginator-intl';

@Component({
  selector: 'app-table',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatPaginator,
    MatSortModule,
    TranslatePipe,
    NestedValuePipe,
    MatSortModule,
    DatePipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T> implements AfterViewInit, OnInit {
  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
    effect(() => {
      this.dataSource.data = this.data();
    });
  }

  public menuX = 0;
  public menuY = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('hiddenMenuTrigger', { static: false }) hiddenMenuTrigger!: MatMenuTrigger;
  @ViewChild(MatSort) sort!: MatSort;

  public columns = input.required<TableColumn[]>();
  private dialog = inject(MatDialog);
  public data = input.required<any>();
  public selectOptionsOnUpdate = input<{ value: string; label: string }[]>([]);
  public modelName = input.required<'Room' | 'Product'>();
  @Output() updateTriggered = new EventEmitter<T>();
  @Output() deleteTriggered = new EventEmitter<T>();
  public actions = input<RowAction[]>([
    {
      name: 'actions.edit',
      icon: 'edit',
      color: 'primary',
      action: (item) => {
        console.log(item);
        this.dialog
          .open(DynamicFormDialogComponent, {
            data: CreateDialogConstants.UPDATE[this.modelName().toUpperCase() as 'ROOM' | 'PRODUCT'](
              item,
              this.selectOptionsOnUpdate()
            ),
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.updateTriggered.emit(result);
            }
          });
      },
    },
    {
      name: 'actions.delete',
      icon: 'delete',
      color: 'warn',
      action: (item) => {
        this.deleteTriggered.emit(item);
      },
    },
  ]);
  public displayedColumns!: Signal<string[]>;
  public dataSource: MatTableDataSource<any>;

  public selectedRow: any;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.displayedColumns = computed(() => this.columns().map((column) => column.property_name));
  }

  public onRowClick(rowData: any, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedRow = rowData;
    this.menuX = event.clientX;
    this.menuY = event.clientY;

    setTimeout(() => {
      this.hiddenMenuTrigger.openMenu();
    }, 0);
  }
}
