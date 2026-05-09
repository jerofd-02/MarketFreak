import {Component, OnInit} from '@angular/core';
import {IonContent, IonFooter, IonHeader, IonToolbar} from '@ionic/angular/standalone';
import {FooterComponent} from '../footer/footer.component';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonFooter,
    FooterComponent,
    IonHeader,
    HeaderComponent,
    IonToolbar
  ]
})
export class PageLayoutComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}
