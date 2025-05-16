import { Component, effect, EventEmitter, input, OnInit, Output } from '@angular/core';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-custom-mat-slide-toggle',
  imports: [MatSlideToggle],
  templateUrl: './custom-mat-slide-toggle.component.html',
  styleUrl: './custom-mat-slide-toggle.component.scss',
})
export class CustomMatSlideToggleComponent implements OnInit {
  onValue = input.required<string | null>();
  offValue = input.required<string | null>();
  currentValue = input.required<string | null>();

  @Output() stateChanged = new EventEmitter<string | null>();
  checked = false;
  pendingValue: string | null = null;

  constructor() {
    effect(() => {
      if (this.pendingValue !== null && this.currentValue() === this.pendingValue) {
        this.pendingValue = null;
      }
      if (this.currentValue() === null || this.offValue() === null || this.onValue() === null) {
        return;
      }
      this.checked = (this.pendingValue ?? this.currentValue()) === this.onValue();
    });
  }

  ngOnInit(): void {}

  onToggleChange(event: MatSlideToggleChange) {
    const newValue = event.checked ? this.onValue() : this.offValue();
    this.pendingValue = newValue;
    this.checked = event.checked;
    this.stateChanged.emit(newValue);
  }

  get displayValue(): string | null {
    return this.pendingValue ?? this.currentValue();
  }
}
