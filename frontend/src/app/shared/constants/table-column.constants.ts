import { TableColumn } from '../types/table.types';

export class TableColumnConstants {
  public static readonly COLUMNS: Record<string, TableColumn[]> = {
    ROOM: [
      {
        property_name: 'name',
        header: 'table_columns.room_name',
      },
      {
        property_name: 'createdAt',
        type: 'date',
        header: 'table_columns.created_at',
      },
      {
        property_name: 'updatedAt',
        type: 'date',
        header: 'table_columns.updated_at',
      },
    ],
    PRODUCT: [
      {
        property_name: 'name',
        header: 'table_columns.product_name',
      },
      {
        property_name: 'Room.name',
        header: 'table_columns.room_name',
      },
      {
        property_name: 'SupportedProduct.product_type',
        header: 'table_columns.product_type',
      },
      {
        property_name: 'SupportedProduct.name',
        header: 'table_columns.supportedProduct_name',
      },
      {
        property_name: 'state',
        header: 'table_columns.product_status',
      },
    ],
  };
}
