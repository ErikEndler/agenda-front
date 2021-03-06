import { TokenService } from './../../auth/token.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoginReturn } from 'src/app/models/loginReturn';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/home',
    title: 'Home',
    icon: 'fas fa-home',
    class: '',
  },
  {
    path: '/usuario/',
    title: 'User Profile',
    icon: 'tim-icons icon-single-02',
    class: '',
  },
  {
    path: '/usuariolist',
    title: 'Listar Usuarios',
    icon: 'tim-icons icon-align-center',
    class: '',
  },
  {
    path: '/categoria',
    title: 'Categoria Form',
    icon: 'tim-icons icon-single-02',
    class: '',
  },
  {
    path: '/categorialist',
    title: 'Listar Categorias',
    icon: 'tim-icons icon-align-center',
    class: '',
  },
  {
    path: '/servico',
    title: 'Servico Form',
    icon: 'tim-icons icon-single-02',
    class: '',
  },
  {
    path: '/servicolist',
    title: 'Listar Serviços',
    icon: 'tim-icons icon-align-center',
    class: '',
  },
  {
    path: '/escala',
    title: 'Escala',
    icon: 'far fa-calendar-alt',
    class: '',
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  loginReturn: LoginReturn;
  routeInfo: any[];
  hide = true;

  menuItems: any[];

  constructor(private auth: AuthService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.auth.eventoLogar.subscribe(() => this.ngOnInit());
    this.loginReturn = this.tokenService.decodePayloadJWT();
    this.constroiIcones();
    this.menuItems = this.routeInfo.filter((menuItem) => menuItem);
  }
  constroiIcones(): void {
    this.routeInfo = [
      {
        path: '/home',
        title: 'Home',
        icon: 'fas fa-home',
        class: '',
      },
      {
        path: '/usuario',
        title: 'Perfil Usuário',
        icon: 'tim-icons icon-single-02',
        class: '',
      },

      {
        path: '/agendamento',
        title: 'Agendamento',
        icon: 'far fa-clock',
        class: '',
      },
    ];
    if (this.loginReturn) {
      if (this.loginReturn.role !== 'ROLE_USER') {
        this.routeInfo.push({
          path: '/servico',
          title: 'Servico',
          icon: 'fas fa-desktop',
          class: '',
        });
        this.routeInfo.push({
          path: '/atendimento',
          title: 'Atendimento',
          icon: 'bi bi-briefcase',
          class: '',
        });
      }
    }
    this.routeInfo.push({
      path: '/ajuda',
      title: 'Ajuda',
      icon: 'far fa-question-circle',
      class: '',
    });
  }
  isMobileMenu(): boolean {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
