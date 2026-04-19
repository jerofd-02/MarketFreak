import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../../services/contact.service';
import { FormStyleData } from '../../models/form-style-page/form-style-page.interface';
import { FormStylePageComponent } from '../../components/form-style-page/form-style-page.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormStylePageComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit, OnDestroy {
  formData: FormStyleData | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.contactService.getForm().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.ngZone.run(() => {
        this.formData = data;
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
