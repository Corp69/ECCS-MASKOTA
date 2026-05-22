import { ApplicationConfig, importProvidersFrom, isDevMode, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';
//import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const MaskotaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '{orange.500}',
      600: '{orange.600}',
      700: '{orange.700}',
      800: '{orange.800}',
      900: '{orange.900}',
      950: '{orange.950}'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true, onViewTransitionCreated(transitionInfo) { }, })),
    //forms
    importProvidersFrom(ReactiveFormsModule),
    // cliente Http
    provideHttpClient(withFetch()),
    //proveedor prime ng
    providePrimeNG({
      ripple: true, // efectos de ondulación
      theme: {
        preset: MaskotaPreset,
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
