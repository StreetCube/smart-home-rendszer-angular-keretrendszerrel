import { AfterViewInit, Component, computed, effect, input, OnInit, Signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';
import { RowAction, TableColumn } from '../../types/table.types';
import { CustomMatPaginatorIntl } from './custom-mat-paginator-intl';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatButtonModule, MatMenuModule, MatIconModule, MatPaginator, MatSortModule, TranslatePipe],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements AfterViewInit, OnInit {
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

  public columns = input.required<TableColumn[]>();
  public data = input.required<any>();
  public actions = input<RowAction[]>([
    {
      name: 'Edit',
      icon: 'edit',
      color: 'primary',
      action: (item) => {
        console.log('Edit', item);
      },
    },
    {
      name: 'Delete',
      icon: 'delete',
      color: 'warn',
      action: (item) => {
        console.log('Delete', item);
      },
    },
  ]);
  public displayedColumns!: Signal<string[]>;
  public dataSource: MatTableDataSource<any>;

  public selectedRow: any;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
