import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FaqService} from '../../services/faq.service';
import {FaqInterface} from '../../models/faq/faq.interface';
import {PageLayoutComponent} from '../page-layout/page-layout.component';

@Component({
  selector: 'app-faq',
  imports: [
    PageLayoutComponent
  ],
  styleUrl: "faq.component.scss",
  templateUrl: "./faq.component.html",
})
export class FaqComponent implements OnInit {
  items: FaqInterface[] = [];

  constructor(private faqService: FaqService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.faqService.getData().subscribe({
      next: (data) => {
        this.items = data;
        this.cdr.detectChanges();
      }
    });
  }
}
