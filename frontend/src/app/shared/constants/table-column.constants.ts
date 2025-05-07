import { TableColumn } from '../types/table.types';

export class TableColumnConstants {
  public static readonly COLUMNS: Record<string, TableColumn[]> = {
    ROOM: [
      {
        property_name: 'name',
        header: 'Room Name',
      },
    ],
  };
}
