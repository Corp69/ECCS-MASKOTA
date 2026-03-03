import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import ImportsModule from '@shared/primeng/ImportsModule';
import { FirmaComponent } from '@shared/eccs/msj/firma/firma.component';
import { EcssMsjLoadingComponent } from '@shared/eccs/msj/loading/loading.component';

@Component({
  imports: [
    RouterModule,
    ImportsModule,

    // firma
    FirmaComponent,
    //ECCS - MSJ - CARGA 
    EcssMsjLoadingComponent
  ],
  templateUrl: './eccs.component.html'
})
export default class EccsComponent {

  //--=============================================================================================================
  //?-- ECCS - Variables de control
  public Eccsblocked = signal<boolean>(false);

}
