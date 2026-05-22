import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import LoadingComponent from '@shared/eccs/loading/loading.component';

@Component({
  selector: 'app-principal',
  imports: [RouterModule, LoadingComponent],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export default class PrincipalComponent {

}
