export interface TableColumn {
  property_name: string;
  header: string;
  sortable?: boolean;
  hide?: boolean;
  onHover?: string;
}

export interface RowAction {
  name: string;
  icon?: string;
  color?: string;
  action: (item: any) => void;
  condition?: (item: any) => boolean;
}
