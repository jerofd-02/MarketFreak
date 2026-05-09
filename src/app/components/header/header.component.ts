import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Header} from '../../models/layout/layout.interface';
import {LayoutService} from '../../services/layout.service';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService, LoggedUser} from '../../services/auth.service';
import {IonButton, IonHeader, IonToolbar} from '@ionic/angular/standalone';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IonHeader, IonToolbar, IonButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  header!: Header;
  user: LoggedUser | null = null;
  searchQuery: string = '';
  menuOpen: boolean = false;
  searchOpen: boolean = false;

  private resizeListener = () => {
    if (window.innerWidth > 1024) {
      this.searchOpen = false;
      this.cdr.detectChanges();
    }
  }

  private userSub?: Subscription;

  constructor(
    private layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.layoutService.getHeader().subscribe({
      next: (data) => {
        this.header = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar el header:', err)
    });

    this.userSub = this.authService.currentUser$.subscribe(async firebaseUser => {
      if (firebaseUser) {
        this.user = await this.authService.getLoggedUser(firebaseUser.uid) as LoggedUser;
      } else {
        this.user = null;
      }
      this.cdr.detectChanges();
    });


    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) this.searchQuery = decodeURIComponent(query);

    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.router.navigate(['/search-product'], {
        queryParams: this.searchQuery.trim() ? {q: this.searchQuery.trim()} : {}
      });
      this.menuOpen = false;
      this.searchOpen = false;
    }
  }

  goToProfile(): void {
    if (this.user) {
      this.router.navigate(['/profile'], {
        queryParams: {seller: this.user.seller}
      })
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
  }
}
