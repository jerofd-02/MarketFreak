import {bootstrapApplication} from '@angular/platform-browser';
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {mergeApplicationConfig} from '@angular/core';
import {appConfig} from './app/app.config';

const ionicConfig = {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
}

bootstrapApplication(AppComponent, mergeApplicationConfig(appConfig, ionicConfig));
