import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  private unsubscribe: Subject<void> = new Subject<void>();
  private ofLabel = 'of';

  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getAndInitTranslations() {
    this.translate
      .get([
        'paginator.items_per_page',
        'paginator.next_page',
        'paginator.previous_page',
        'paginator.first_page',
        'paginator.last_page',
        'paginator.of_label',
      ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((translations) => {
        this.itemsPerPageLabel = translations['paginator.items_per_page'];
        this.nextPageLabel = translations['paginator.next_page'];
        this.previousPageLabel = translations['paginator.previous_page'];
        this.firstPageLabel = translations['paginator.first_page'];
        this.lastPageLabel = translations['paginator.last_page'];
        this.ofLabel = translations['paginator.of_label'];
        this.changes.next();
      });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.ofLabel} ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.ofLabel} ${length}`;
  };
}
