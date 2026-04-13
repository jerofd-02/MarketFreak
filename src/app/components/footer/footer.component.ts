import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Footer} from '../../models/layout/layout.interface';
import {LayoutService} from '../../services/layout.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  footer!: Footer;

  constructor(private layoutService: LayoutService) {
  }

  ngOnInit(): void {
    this.layoutService.getFooter().subscribe({
      next: (data) => this.footer = data,
      error: (err) => console.log("Error al cargar el footer:", err)
    });
  }
}
