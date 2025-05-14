import { Validators } from '@angular/forms';
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
}
