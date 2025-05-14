import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nestedValue', pure: true })
export class NestedValuePipe implements PipeTransform {
  transform(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}
