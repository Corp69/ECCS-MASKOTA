import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, signal } from '@angular/core';
import { Observable, Subject, catchError, map, of, switchMap, throwError } from 'rxjs';

import { MdlUser } from '../Models/MdlUser';
import  { ErroresService}   from '@shared/services/errores.service';
import { StorageService } from '@shared/services/Storage.service';
import { environment } from '@environments';

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

  //--=============================================================================================================
  //?-- ARIES ERP - AUTH - logeo en eccs y validacion de licencia
  public LoginECCS(modelo: MdlUser): Observable<{ Response: any; Success: boolean; Mensaje: string, token: string }> {
    // Limpiamos el local storage para evitar conflictos con otros tokens o datos almacenados
    this.StorageService.ClearLocalStorage();
    return this.errores.handleRequest(`${environment.baseUrl}auth/empresas/login`, modelo);
  }

  //--=============================================================================================================
  //?-- ARIES ERP - AUTH - Login completo: BD + validación de empleado
  // Combina el login en BD y la validación del empleado en una sola operación
  public login(id: number, modelo: MdlUser): Observable<{ Response: any; Success: boolean; Mensaje: string, token: string }> {
    return this.errores.handleRequest<{ Response: any; Success: boolean; Mensaje: string, token: string }>(
      `${environment.baseUrl}auth/login/${id}`,
      modelo
    ).pipe(
      switchMap((resp: { Response: any; Success: boolean; Mensaje: string, token: string }) => {
        this.StorageService.setItem('token', resp.token);
        if (resp.Success) {
          return this.errores.handleRequest<{ Response: any; Success: boolean; Mensaje: string, token: string }>(
            `${environment.baseUrl}arieserp/empresa/login`,
            modelo
          ).pipe(
            map((respEmpleado) => {
              console.log('Respuesta empleado:', respEmpleado.Response);
              const usuario = respEmpleado.Response.usuario;
              this.StorageService.setItem('id_eccs_empleado', usuario.id_eccs_empleado);
              this.StorageService.setItem('id_eccs_usuario', usuario.id_eccs_usuario);
              this.StorageService.setItem('id_estatus_empleado', usuario.id_estatus_empleado);
              this.StorageService.setItem('id_estatus_usuario', usuario.id_estatus_usuario);
              this.StorageService.setItem('id_arieserp_sucursal', usuario.id_arieserp_sucursal);
              this.StorageService.setItem('id_arieserp_sucursal_domicilio', usuario.id_arieserp_sucursal_domicilio);

              this.StorageService.setItem('departamento', usuario.departamento);
              this.StorageService.setItem('puesto', usuario.puesto);
              this.StorageService.setItem('empleado', usuario.empleado);
              this.StorageService.setItem('estatus', usuario.estatus);
              this.StorageService.setItem('usuario', usuario.usuario);
              return respEmpleado;
            })
          );
        } else {
          return throwError(() => resp);
        }
      })
    );
  }

  public checkAuthentication(): Observable<boolean> {
    this.MdlUser.set_tokken(this.StorageService.getItem('token') !== null ? this.StorageService.getItem('token') : "");
    const token = this.MdlUser.get_tokken();
    if (!token) return of(false);
    return of(true);
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
      .catch(() => { });
  }
  public transitionComplete = signal<boolean>(false);

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

}
