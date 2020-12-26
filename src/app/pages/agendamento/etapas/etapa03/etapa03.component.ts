import { Agendamento } from './../../../../models/agendamento';
import { Observable } from 'rxjs';
import { Escala } from './../../../../models/escala';
import { EscalaService } from './../../../escala/escala.service';
import { Component, OnInit } from '@angular/core';
import { ServicoFuncionario } from 'src/app/models/servico-funcionario';
import { ServicoFuncionarioService } from 'src/app/pages/servico-funcionario/servico-funcionario.service';
import { ErroService } from 'src/app/shared/erro/erro.service';
import { EtapasService } from '../etapas.service';
import * as moment from 'moment';
import { NotificacaoService } from 'src/app/shared/notificacao/notificacao.service';
import { NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-etapa03',
  templateUrl: './etapa03.component.html',
  styleUrls: ['./etapa03.component.css'],
})
export class Etapa03Component implements OnInit {
  listempy = false;
  horariosHide = true;
  page = 1;
  pageSize = 4;
  collectionSize: any;
  loading = false;
  avancar: false;
  dias: string[] = [];
  servicoFuncionario: ServicoFuncionario;
  escalas$: Observable<Escala[]>;
  agendamento: Agendamento = new Agendamento();
  data: string;
  hrInicial: string;
  hrFinal: string;

  constructor(
    private servicoFuncionarioService: ServicoFuncionarioService,
    private erroService: ErroService,
    private etapasService: EtapasService,
    private escalaService: EscalaService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.etapasService.eventoServicoFuncionario.subscribe((result) => {
      this.servicoFuncionario = result;
      this.agendamento.servicoFuncionarioId = result.id;
      this.buscaEscala();
    });
  }
  buscaEscala(): void {
    this.escalas$ = this.escalaService.listarPorServicoFuncionario(
      this.servicoFuncionario.id
    );
    this.escalas$.subscribe((result) =>
      result.forEach((e) => {
        if (e.itensEscala.length > 0) {
          this.dias.push(e.diaSemana);
        }
      })
    );
  }
  dayselect(valor): void {
    moment.locale('pt-br');
    this.loading = true;
    if (moment(valor).format('DD-MM-yyyy') >= moment().format('DD-MM-yyyy')) {
      if (this.dias.indexOf(moment(valor).format('dddd')) !== -1) {
        this.data = valor;
        this.horariosHide = false;
      } else {
        this.notificacaoService.criar(
          NotificationType.Warn,
          moment(valor).format('dddd'),
          'Fora da escala'
        );
      }
    } else {
      this.horariosHide = true;
      this.notificacaoService.criar(
        NotificationType.Warn,
        'Erro',
        'Selecione data apartir da data atual'
      );
    }

    this.loading = false;
  }
  selectHora() {
    this.hrFinal = moment(this.hrInicial, 'HH:mm')
      .add(this.servicoFuncionario.servico.tempo, 'm')
      .format('HH:mm');
  }
}