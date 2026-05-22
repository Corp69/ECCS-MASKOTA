import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Services
import { LoginService } from './services/login.service';
import { StorageService } from '@shared/services/Storage.service';

// PrimeNG
import { MessageService } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';
import ImportsModule  from '@shared/primeng/ImportsModule';

// Components

@Component({
  selector: 'app-login',
  imports: [
    ImportsModule,
    RouterModule,
    CommonModule,
    StyleClassModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit {

  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Inyecciones de servicios
  // Servicios inyectados para el manejo de autenticación y navegación
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  public readonly servicio = inject(LoginService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Variables globales HTML
  // Señales para el control de estado de la interfaz
  public Ariesblocked = signal<boolean>(false);
  public mostrarDialogEmpresas = signal<boolean>(false);

  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Datos de empresas
  // Lista de empresas disponibles para selección
  public empresas: any[] = [];

  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Formulario
  // Formulario reactivo para captura de credenciales
  public formLogin: FormGroup;

  constructor() {
    this.formLogin = this.fb.group({
      usuario: [null, [Validators.required, Validators.minLength(4)]],
      pass: [null, [Validators.required, Validators.minLength(4)]]
    });
  }

  //--=============================================================================================================
  //?-- MASKOTA - LOGIN TEST - Login temporal mientras se desarrolla el backend
  public loginTest(): void {
    if (this.formLogin.value.usuario === 'admin' && this.formLogin.value.pass === '1234') {
      this.router.navigate(['/maskota/principal']);
    } else {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Maskota', detail: 'Credenciales inválidas. Usa admin / 1234' });
    }
  }

  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Validación inicial de credenciales
  // Valida las credenciales del usuario contra el servicio ECCS
  public onSave(): void {
    this.loginTest();
    return;

    this.Ariesblocked.set(true);

    this.servicio.LoginECCS(this.formLogin.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp) => {
          if (!resp.Success) {
            this.Ariesblocked.set(false);
            this.messageService.add({ key: 'tc', severity: 'warn', summary: 'ScorpioXL', detail: 'contraseña invalida | verifica credenciales y licencia que esten activas.' });
            return;
          }

          if (resp.Response.empresas === null) {
            this.Ariesblocked.set(false);
            this.messageService.add({ key: 'tc', severity: 'warn', summary: 'ScorpioXL', detail: 'licencia de tu empresa debe estar activa contacta soporte.' });
            return;
          }

          this.empresas = resp.Response.empresas;
          this.mostrarDialogEmpresas.set(true);
          this.Ariesblocked.set(false);
        },
        error: () => {
          this.Ariesblocked.set(false);
        }
      });
  }

  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Selección de empresa
  // Maneja la selección de empresa del usuario con login completo
  public seleccionarEmpresa(id: number): void {
    this.Ariesblocked.set(true);
    // Login completo: BD + validación empleado en una sola llamada
    this.servicio.login(id, this.formLogin.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp) => {

          console.log( resp);
          


          if (resp.Success) {
            this.Ariesblocked.set(false);
            this.mostrarDialogEmpresas.set(false);
            setTimeout(() => {
              this.router.navigate(['/maskota/principal']);
            }, 100);
          } else {
            this.Ariesblocked.set(false);
          }
        },
        error: () => {
          this.Ariesblocked.set(false);
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'ScorpioXL', detail: 'Error al iniciar sesión en la empresa seleccionada.' });
        }
      });
  }


  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Inicialización del componente
  // Configura el componente al inicializarse
  public ngOnInit(): void {
    this.servicio.onConfigUpdate();
  }

  //--=============================================================================================================
  //?-- ARIES ERP - LOGIN - Alternar modo oscuro
  // Cambia entre tema claro y oscuro de la aplicación

}

