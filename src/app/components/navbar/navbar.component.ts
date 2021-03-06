import { NotificacaoRxService } from './../notificacao/notificacao-rx.service';
import { UsuarioService } from 'src/app/pages/usuario/usuario.service';
import { TokenService } from './../../auth/token.service';
import { LoginReturn } from 'src/app/models/loginReturn';
import { AuthService } from './../../auth/auth.service';
import { ModalLoginService } from './../../shared/modal-login/modal-login.service';
import { Component, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoService } from 'src/app/shared/modal-confirmacao/modal-confirmacao.service';
import { switchMap, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  hide = false;
  newNotification = false;
  loginStatus = false;
  private listTitles: any[];
  location: Location;
  mobileMenuVisible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  loginReturn: LoginReturn;
  public isCollapsed = true;
  closeResult: string;
  agendados: number;
  agendadosHoje: number;
  pendentes: number;
  naoAtendido: number;
  exibirNaoAtendido = false;
  exibirAgendado = false;
  exibirAgendadoHoje = false;
  novoPendente = true;
  listaNotificacao = [];
  // notificação recebida
  notificacaoNova = [];

  constructor(
    private modalLoginService: ModalLoginService,
    private usuarioService: UsuarioService,
    location: Location,
    private element: ElementRef,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private tokenService: TokenService,
    private modalConfirm: ModalConfirmacaoService,
    private auth: AuthService,
    private notificacaoRxService: NotificacaoRxService
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }
  // VARIAVEIS NOTIFICAÇÃO
  // fazer piscar
  // https://codepen.io/anasandoval90/pen/jPXxaR
  novoAgendamento;
  agendamentoPendente;

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    const navbar = document.getElementsByClassName('navbar')[0];
    if (window.innerWidth < 993 && !this.isCollapsed) {
      navbar.classList.add('bg-white');
      navbar.classList.remove('navbar-transparent');
    } else {
      navbar.classList.remove('bg-white');
      navbar.classList.add('navbar-transparent');
    }
  };
  chamarperfil(): void {
    const id = sessionStorage.getItem('id');
    this.router.navigate(['usuarioEditar', id]);
  }
  // chama login
  login(): void {
    this.modalLoginService.open();
  }
  logout(): void {
    // this.authService.deslogar();
    this.modalConfirm
      .showConfirm('Deslogar', 'Deseja Deslogar??', 'Deslogar')
      .subscribe((result) => {
        if (result) {
          this.authService.deslogar();
        }
      });
  }
  verificaLogin(): boolean {
    if (sessionStorage.getItem('logado')) {
      return (this.loginStatus = true);
    } else {
      return (this.loginStatus = false);
    }
  }

  ngOnInit(): void {
    this.auth.eventoLogar.subscribe(() => {
      this.ngOnInit();
    });
    this.notificacaoRxService.novaNotificacao.subscribe((result) =>
      this.novaNotificacao(result)
    );

    this.loginReturn = this.tokenService.decodePayloadJWT();
    if (this.loginReturn) {
      this.notificacaoRxService.connectClicked(this.loginReturn.cpf);
    }
    window.addEventListener('resize', this.updateColor);
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      const $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobileMenuVisible = 0;
      }
    });
    // this.notificacao();
  }
  clickNovaNotificacao(index: number, piscar: boolean, id: number) {
    console.log('index=', index);
    this.listaNotificacao.splice(index, 1);
    this.newNotification = piscar;
    if (this.loginReturn.role === 'ROLE_USER') {
      this.router.navigate(['agendamento/cliente/' + id]);
    } else if (this.loginReturn.role === ('ROLE_ADMIN' || 'ROLE_FUNCIONARIO')) {
      this.router.navigate(['agendamento/form/' + id]);
    }
  }
  agendamentosStatus(tipo: string) {
    if (this.loginReturn.role === ('ROLE_ADMIN' || 'ROLE_FUNCIONARIO')) {
      if (tipo === 'pendente') {
        this.router.navigate(['agendamento/status']);
      } else if (tipo === 'naoatendido') {
        this.router.navigate(['agendamento/status'], {
          queryParams: { status: 'naoatendido' },
        });
      } else if (tipo === 'agendado') {
        this.router.navigate(['agendamento/status'], {
          queryParams: { status: 'agendado' },
        });
      }
    } else if (this.loginReturn.role === 'ROLE_USER') {
      this.router.navigate(['meusagendamentos']);
    }
  }
  novaNotificacao(msg: string): void {
    this.newNotification = true;
    this.notificacaoNova = msg.split('#');
    console.log(this.notificacaoNova);
    this.listaNotificacao.push(this.notificacaoNova);
    console.log(this.listaNotificacao);
  }

  notificacao(): void {
    if (this.loginReturn) {
      this.usuarioService
        .buscarNotificacaoBase(this.loginReturn.id)
        .subscribe((result) => {
          console.log(result);
          this.agendados = result[0];
          this.pendentes = result[1];
          this.naoAtendido = result[2];
          this.agendadosHoje = result[3];
          if (this.loginReturn.role !== 'ROLE_USER' && this.naoAtendido > 0) {
            this.exibirNaoAtendido = true;
          }
          if (this.loginReturn.role === 'ROLE_USER' && this.agendados > 0) {
            this.exibirAgendado = true;
          }
          if (this.loginReturn.role !== 'ROLE_USER' && this.agendadosHoje > 0) {
            this.exibirAgendadoHoje = true;
          }
        });
    }
  }

  collapse(): void {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }
  }

  sidebarOpen(): void {
    const toggleButton = this.toggleButton;
    const mainPanel = document.getElementsByClassName(
      'main-panel'
    )[0] as HTMLElement;

    const html = document.getElementsByTagName('html')[0];
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }

    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');

    this.sidebarVisible = true;
  }
  sidebarClose(): void {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    const mainPanel = document.getElementsByClassName(
      'main-panel'
    )[0] as HTMLElement;

    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  }
  sidebarToggle(): void {
    // const toggleButton = this.toggleButton;
    // const html = document.getElementsByTagName('html')[0];
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const html = document.getElementsByTagName('html')[0];

    if (this.mobileMenuVisible == 1) {
      // $('html').removeClass('nav-open');
      html.classList.remove('nav-open');
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove('toggled');
      }, 400);

      this.mobileMenuVisible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add('toggled');
      }, 430);

      var $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');

      if (html.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (html.classList.contains('off-canvas-sidebar')) {
        document
          .getElementsByClassName('wrapper-full-page')[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add('visible');
      }, 100);

      $layer.onclick = function () {
        //asign a function
        html.classList.remove('nav-open');
        this.mobileMenuVisible = 0;
        $layer.classList.remove('visible');
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      html.classList.add('nav-open');
      this.mobileMenuVisible = 1;
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  newopen() {}
  open(content) {
    this.modalService
      .open(content, { windowClass: 'modal-search' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.updateColor);
  }
}
