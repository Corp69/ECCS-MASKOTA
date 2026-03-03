import { ApplicationConfig, importProvidersFrom, isDevMode, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';
//import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideZonelessChangeDetection(),
    //routes
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true, onViewTransitionCreated(transitionInfo) { }, })),
    //forms
    importProvidersFrom(ReactiveFormsModule),
    // cliente Http
    provideHttpClient(withFetch()),
    //proveedor prime ng
    providePrimeNG({
      ripple: true, // efectos de ondulación
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' }
      }
    }), 
    // provideServiceWorker('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   registrationStrategy: 'registerWhenStable:30000'
    // }), 
    // provideServiceWorker('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   registrationStrategy: 'registerWhenStable:30000'
    // })

  ]
};
