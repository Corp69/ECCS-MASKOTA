import { HttpClient } from '@angular/common/http';
import { Injectable,  computed, effect, signal } from '@angular/core';
import { Observable, Subject, catchError, map, of,  throwError } from 'rxjs';
import { StorageService } from '@shared/services/Storage.service';
import { environment } from '@environments';
import { ErroresService } from '@shared/services/errores.service';
import { MdlUser } from '@shared/Models/MdlUser';

export interface layoutConfig {

  preset?: string;
  primary?: string;
  surface?: string | undefined | null;
  darkTheme?: boolean;
  menuMode?: string;
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public _config: layoutConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: true,
    menuMode: 'static'
  };

  layoutConfig = signal<layoutConfig>(this._config);
  isDarkTheme = computed(() => this.layoutConfig().darkTheme);


  private configUpdate = new Subject<layoutConfig>();
  private initialized = false;
  //==============================================================================================================
  //modelos:
  public MdlUser: MdlUser = new MdlUser();

  constructor(
      private StorageService: StorageService,
      private http: HttpClient,
      private errores: ErroresService,

    ) {
      effect(() => {
        const config = this.layoutConfig();
        if (config) {
            this.onConfigUpdate();
        }
    });

    effect(() => {
        const config = this.layoutConfig();
        if (!this.initialized || !config) {
            this.initialized = true;

            return;
        }
        this.handleDarkModeTransition(config);
    });
    }

  public onConfigUpdate() {
      this._config = { ...this.layoutConfig() };
      this.configUpdate.next(this.layoutConfig());
  }

   public toggleDarkMode(config?: layoutConfig): void {
      const _config = config || this.layoutConfig();
      if (_config.darkTheme) {
          document.documentElement.classList.add('app-dark');
      } else {
          document.documentElement.classList.remove('app-dark');
      }
  }


  public IniciarSesion(modelo: MdlUser): Observable<any> {
    return this.http
      .post(`${environment.baseUrl}auth/login`, modelo)
      .pipe(
        catchError(error => {
          return throwError(this.errores.getErrores(error));
        })
      );
  }
  

  public checkAuthentication(): Observable<boolean> {
    this.MdlUser.set_tokken(this.StorageService.getItem('token') !== null ? this.StorageService.getItem('token') : "");
    const token = this.MdlUser.get_tokken();
    if (!token) return of(false);

    const tokenObject = { "token": token };
    return this.http.post(`${environment.baseUrl}auth/token`, tokenObject).pipe(
      map((user: any) => !!user),
      catchError(err => of(false))
    );
  }

  //animacion de cambio de color
  private handleDarkModeTransition(config: layoutConfig): void {
    if ((document as any).startViewTransition) {
        this.startViewTransition(config);
    } else {
        this.toggleDarkMode(config);
        this.onTransitionEnd();
    }
}

    private startViewTransition(config: layoutConfig): void {
      const transition = (document as any).startViewTransition(() => {
          this.toggleDarkMode(config);
      });

      transition.ready
          .then(() => {
              this.onTransitionEnd();
          })
          .catch(() => {});
    }
    public transitionComplete = signal<boolean>(false);

    private onTransitionEnd() {
      this.transitionComplete.set(true);
      setTimeout(() => {
          this.transitionComplete.set(false);
      });
    }

}
