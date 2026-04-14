import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Header} from '../../models/layout/layout.interface';
import {LayoutService} from '../../services/layout.service';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService, LoggedUser} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  header!: Header;
  user: LoggedUser | null = null;
  searchQuery: string = '';
  menuOpen: boolean = false;

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

    this.user = this.authService.getLoggedUser();

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) this.searchQuery = decodeURIComponent(query);
  }

  onSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: {q: this.searchQuery.trim()}
      });
      this.menuOpen = false;
    }
  }

  goToProfile(): void {
    if (this.user) {
      this.router.navigate(['/profile'], {
        queryParams: {seller: this.user.seller}
      })
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
