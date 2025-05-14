export interface Product {
  id: string;
  ieeeAdress: string;
  name: string;
  supportedProduct: SupportedProduct;
}

export interface SupportedProduct {
  id: string;
  name: string;
  productType: string;
}

export interface ProductCapability {
  id: string;
  access: number;
  description: string;
  label: string;
  name: string;
  type: string;
  property: string;
  createdAt: Date;
  updatedAt: Date;
  supportedProductId: string;
  EnumExposeId: string | null;
  NumericExposeId: string | null;
  BinaryExposeId: string | null;
}

export interface Product_GetAllResponse {
  id: string;
  ieeeAddress: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  SupportedProductId: string;
  RoomId: string;
  Room: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  SupportedProduct: {
    id: string;
    name: string;
    product_type: string;
    createdAt: string;
    updatedAt: string;
    ProductCapabilities: {
      id: string;
      description: string;
    }[];
  };
}

export interface Product_For_Create {
  name: string;
  roomId: string;
}

export interface BinaryExpose {
  id: string;
  value_on: string;
  value_off: string;
  value_toggle: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnumExpose {
  id: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NumericExpose {
  id: string;
  value_min: number | null;
  value_max: number | null;
  value_step: number | null;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceState {
  boolValue: string | null;
  numericValue: number | null;
  textValue: string | null;
  ProductCapabilityId: string;
}

export interface ProductCapabilityFull {
  id: string;
  name: string;
  type: string;
  access: number;
  label: string;
  property: string;
  description: string;
  BinaryExpose: BinaryExpose | null;
  EnumExpose: EnumExpose | null;
  NumericExpose: NumericExpose | null;
  deviceState: DeviceState;
}

export interface SupportedProductFull {
  name: string;
  product_type: string;
  ProductCapabilities: ProductCapabilityFull[];
}

export interface ProductForRoom {
  state: boolean;
  ieeeAddress: string;
  name: string;
  SupportedProduct: SupportedProductFull;
}
