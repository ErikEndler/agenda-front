import { UsuarioService } from './../../usuario/usuario.service';
import { LoginReturn } from './../../../models/loginReturn';
import { TokenService } from 'src/app/auth/token.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-agendamento-home',
  templateUrl: './agendamento-home.component.html',
  styleUrls: ['./agendamento-home.component.css']
})
export class AgendamentoHomeComponent implements OnInit {

  loginReturn: LoginReturn;

  constructor(
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.loginReturn = this.tokenService.decodePayloadJWT();
  }

}
