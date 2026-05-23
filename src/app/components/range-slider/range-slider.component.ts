import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss',
})
export class RangeSliderComponent implements OnInit {
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Output() rangeChange = new EventEmitter<{ min: number; max: number }>();

  currentMin: number = 0;
  currentMax: number = 100;

  readonly gray = '#bbbfbf';
  readonly active = '#b6465f';

  ngOnInit(): void {
    this.currentMin = this.min;
    this.currentMax = this.max;
  }

  get minPercent(): number {
    return ((this.currentMin - this.min) / (this.max - this.min)) * 100;
  }

  get maxPercent(): number {
    return ((this.currentMax - this.min) / (this.max - this.min)) * 100;
  }

  get minBackground(): string {
    return `linear-gradient(to right, ${this.gray} 0%, ${this.gray} ${this.minPercent}%, transparent ${this.minPercent}%, transparent 100%)`;
  }

  get maxBackground(): string {
    return `linear-gradient(to right, ${this.active} 0%, ${this.active} ${this.maxPercent}%, ${this.gray} ${this.maxPercent}%, ${this.gray} 100%)`;
  }

  onMinChange(value: number): void {
    this.currentMin = Math.min(value, this.currentMax);
    this.rangeChange.emit({min: this.currentMin, max: this.currentMax});
  }

  onMaxChange(value: number): void {
    this.currentMax = Math.max(value, this.currentMin);
    this.rangeChange.emit({min: this.currentMin, max: this.currentMax});
  }
}
