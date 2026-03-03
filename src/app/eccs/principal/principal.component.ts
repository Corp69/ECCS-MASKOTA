import { Component, OnInit, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MessageService } from 'primeng/api';
import ImportsModule from '@shared/primeng/ImportsModule';
import { EcssMsjLoadingComponent } from '@shared/eccs/msj/loading/loading.component';

@Component({
  imports: [
    NgStyle,
    //prime NG
    ImportsModule, 
    //ECCS - MSJ - CARGA 
    EcssMsjLoadingComponent
  ],
  providers: [ MessageService ],
  templateUrl: './principal.component.html'
})
export default class PrincipalComponent implements OnInit {
  //--=============================================================================================================
  //?-- ECCS - Variables de control
  public Eccsblocked = signal<boolean>(true);
  public modalVisible = signal<boolean>(false);

  //--=============================================================================================================
  //?-- ECCS - Variables de control
  public ngOnInit(): void {
    this.Eccsblocked.set(false);
  }

  public mostrarModal(): void {
    this.modalVisible.set(true);
  }

}
