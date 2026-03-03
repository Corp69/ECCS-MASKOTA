import { Component, OnInit, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import ImportsModule from '@shared/primeng/ImportsModule';
import { EcssMsjLoadingComponent } from '@shared/eccs/msj/loading/loading.component';

interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  peso: number;
  color: string;
  dueno: string;
  telefono: string;
  fechaRegistro: string;
}

@Component({
  imports: [
    NgStyle,
    FormsModule,
    ImportsModule, 
    EcssMsjLoadingComponent
  ],
  providers: [ MessageService ],
  templateUrl: './principal.component.html'
})
export default class PrincipalComponent implements OnInit {
  public Eccsblocked = signal<boolean>(false);
  public mascotas = signal<Mascota[]>([]);
  public dialogVisible = signal<boolean>(false);
  public isEdit = signal<boolean>(false);
  
  public mascotaForm: Mascota = this.resetForm();

  constructor(private messageService: MessageService) {}

  public ngOnInit(): void {
    this.cargarMascotas();
  }

  private cargarMascotas(): void {
    const data = localStorage.getItem('mascotas');
    if (data) {
      this.mascotas.set(JSON.parse(data));
    } else {
      this.inicializarDatos();
    }
  }

  private inicializarDatos(): void {
    const mascotasIniciales: Mascota[] = [
      { id: 1, nombre: 'Max', raza: 'Labrador', edad: 3, peso: 30, color: 'Dorado', dueno: 'Juan Perez', telefono: '5512345678', fechaRegistro: '2024-01-15' },
      { id: 2, nombre: 'Luna', raza: 'Chihuahua', edad: 2, peso: 3, color: 'Cafe', dueno: 'Maria Garcia', telefono: '5523456789', fechaRegistro: '2024-02-20' },
      { id: 3, nombre: 'Rocky', raza: 'Pastor Aleman', edad: 4, peso: 35, color: 'Negro', dueno: 'Carlos Lopez', telefono: '5534567890', fechaRegistro: '2024-03-10' },
      { id: 4, nombre: 'Bella', raza: 'Poodle', edad: 1, peso: 5, color: 'Blanco', dueno: 'Ana Martinez', telefono: '5545678901', fechaRegistro: '2024-04-05' },
      { id: 5, nombre: 'Thor', raza: 'Husky', edad: 5, peso: 28, color: 'Gris', dueno: 'Pedro Sanchez', telefono: '5556789012', fechaRegistro: '2024-05-12' }
    ];
    localStorage.setItem('mascotas', JSON.stringify(mascotasIniciales));
    this.mascotas.set(mascotasIniciales);
  }

  public abrirDialog(mascota?: Mascota): void {
    if (mascota) {
      this.isEdit.set(true);
      this.mascotaForm = { ...mascota };
    } else {
      this.isEdit.set(false);
      this.mascotaForm = this.resetForm();
    }
    this.dialogVisible.set(true);
  }

  public guardarMascota(): void {
    const mascotas = [...this.mascotas()];
    
    if (this.isEdit()) {
      const index = mascotas.findIndex(m => m.id === this.mascotaForm.id);
      mascotas[index] = this.mascotaForm;
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Mascota actualizada correctamente' });
    } else {
      this.mascotaForm.id = Date.now();
      this.mascotaForm.fechaRegistro = new Date().toISOString().split('T')[0];
      mascotas.push(this.mascotaForm);
      this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'Mascota registrada correctamente' });
    }
    
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
    this.mascotas.set(mascotas);
    this.dialogVisible.set(false);
  }

  public eliminarMascota(id: number): void {
    const mascotas = this.mascotas().filter(m => m.id !== id);
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
    this.mascotas.set(mascotas);
    this.messageService.add({ severity: 'warn', summary: 'Eliminado', detail: 'Mascota eliminada correctamente' });
  }

  private resetForm(): Mascota {
    return { id: 0, nombre: '', raza: '', edad: 0, peso: 0, color: '', dueno: '', telefono: '', fechaRegistro: '' };
  }

  public get totalMascotas(): number {
    return this.mascotas().length;
  }
}
