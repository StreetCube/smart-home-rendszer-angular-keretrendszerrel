import { Validators } from '@angular/forms';
import { Product_GetAllResponse } from '../../features/products/types/Product';
import { Room } from '../../features/rooms/types/Room';
import { DynamicFormField } from '../types/form.model';

export type CreateDialogData = {
  title: string;
  fields: DynamicFormField[];
};

export class CreateDialogConstants {
  public static CREATE_ROOM(userId: string): CreateDialogData {
    return {
      title: 'create.room.title',
      fields: [
        {
          key: 'name',
          label: 'create.room.name',
          type: 'text',
          validators: [Validators.required],
          initialValue: '',
          hidden: false,
        },
        {
          key: 'UserId',
          initialValue: userId,
          hidden: true,
        },
      ],
    };
  }

  public static CREATE_PRODUCT(selectOptions: { value: string; label: string }[]): CreateDialogData {
    return {
      title: 'create.product.title',
      fields: [
        {
          key: 'name',
          label: 'create.product.name',
          type: 'text',
          validators: [Validators.required],
          initialValue: '',
          hidden: false,
        },
        {
          key: 'RoomId',
          label: 'create.product.room',
          type: 'select',
          options: selectOptions,
          validators: [Validators.required],
          initialValue: '',
          hidden: false,
        },
      ],
    };
  }

  // ...existing code...
  public static UPDATE: {
    ROOM: (data: Room) => CreateDialogData;
    PRODUCT: (data: Product_GetAllResponse, selectOptions: { value: string; label: string }[]) => CreateDialogData;
  } = {
    ROOM: (data: Room) => ({
      title: 'update.room.title',
      fields: [
        {
          key: 'name',
          label: 'create.room.name',
          type: 'text',
          validators: [Validators.required],
          initialValue: data?.name ?? '',
          hidden: false,
        },
        {
          key: 'id',
          initialValue: data?.id ?? '',
          hidden: true,
        },
      ],
    }),
    PRODUCT: (data: Product_GetAllResponse, selectOptions: { value: string; label: string }[]) => ({
      title: 'update.product.title',
      fields: [
        {
          key: 'name',
          label: 'create.product.name',
          type: 'text',
          validators: [Validators.required],
          initialValue: data?.name ?? '',
          hidden: false,
        },
        {
          key: 'id',
          initialValue: data?.id ?? '',
          hidden: true,
        },
        {
          key: 'RoomId',
          label: 'create.product.room',
          type: 'select',
          options: selectOptions,
          validators: [Validators.required],
          initialValue: data?.RoomId ?? '',
          hidden: false,
        },
        // Add more fields as needed for PRODUCT
      ],
    }),
  };
  // ...existing code...
}
