import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../../services/contact.service';
import { FormStyleData } from '../../models/form-style-page/form-style-page.interface';
import { FormStylePageComponent } from '../../components/form-style-page/form-style-page.component';
import {FirestoreService} from '../../services/firestore.service';
import {Router} from '@angular/router';
import {PageLayoutComponent} from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormStylePageComponent, PageLayoutComponent],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css',
})
export class ContactPage implements OnInit, OnDestroy {
  formData: FormStyleData | null = null;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private contactService: ContactService,
    private firestoreService: FirestoreService,
    private router: Router,
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

  async onFormSubmit(event: { formValue: any, images: File[] }): Promise<void> {
    this.isSubmitting = true;
    const timestamp = Date.now().toString();

    const imageUrls = event.images.length > 0
      ? await this.firestoreService.uploadImages(event.images, `support-request/${timestamp}`)
      : [];

    const problemOptions = this.formData?.fields['problem']?.options ?? [];
    const problemLabel = problemOptions.find(
      opt => opt.value === event.formValue.problem
    )?.label ?? event.formValue.problem;

    const data = {
      ...event.formValue,
      problem: problemLabel,
      images: imageUrls,
      createdAt: new Date()
    };

    this.firestoreService.saveDocument('support-request', data).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        console.error('Error al guardar consulta:', err);
        this.isSubmitting = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
