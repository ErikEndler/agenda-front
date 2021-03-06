import { Observable } from 'rxjs';
import { ServicoFuncionario } from './../../../models/servico-funcionario';
import { ServicoFuncionarioService } from './../../servico-funcionario/servico-funcionario.service';
import { ErroService } from './../../../shared/erro/erro.service';
import { ServicoEscalaFormService } from './../servico-escala-form.service';
import { Component, Input, OnInit } from '@angular/core';
import { Servico } from 'src/app/models/servico';
import { NotificacaoService } from 'src/app/shared/notificacao/notificacao.service';
import { NotificationType } from 'angular2-notifications';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servico-escala-form',
  templateUrl: './servico-escala-form.component.html',
  styleUrls: ['./servico-escala-form.component.css'],
})
export class ServicoEscalaFormComponent implements OnInit {
  constructor(
    private servicoEscalaFormService: ServicoEscalaFormService,
    private notificacaoService: NotificacaoService,
    private erroService: ErroService,
    private servicoFuncionarioService: ServicoFuncionarioService,
    private router: Router
  ) {}
  selecionado = false;
  // servicoFuncionario: ServicoFuncionario[] = [];
  servicoOut: Servico[] = [];
  listaServicoFuncionario: ServicoFuncionario[];
  lista: ServicoFuncionario[];
  //listaServicoFuncionario$: Observable<ServicoFuncionario[]>;
  page = 1;
  pageSize = 5;
  collectionSize: any;
  loading = true;
  colunas: string[] = ['select', 'nome', 'descrição', 'categoria'];
  @Input() funcionario: Usuario;

  ngOnInit(): void {
    this.list();
  }
  list(): void {
    this.loading = true;
    this.servicoFuncionarioService
      .listarServicosFuncionario(this.funcionario.id)
      .subscribe(
        (dados) => {
          this.collectionSize = dados.length;
          this.loading = false;
          this.listaServicoFuncionario = dados;
          this.refreshListServico();
        },
        (error) => {
          console.error(error);
          this.erroService.tratarErro(error);
        }
      );
  }

  refreshListServico(): void {
    this.lista = this.listaServicoFuncionario
      .map((servico, i) => ({ ...servico }))
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize
      );
  }
  // avança para proxima estapa do wizard
  next(): void {
    this.verificaSelecao();
    this.servicoEscalaFormService.emiteServicoEatapa2(this.servicoOut);
  }
  verificaSelecao(): void {
    if (this.servicoOut === undefined) {
      this.notificacaoService.criar(
        NotificationType.Error,
        'Erro',
        'Selecione uma opção'
      );
    }
  }
  // ao selecionar um item tabela atribui valor da linha a variavel servicos
  onChange(servico: Servico, isChecked: boolean): void {
    // implementar pegar id servico e id funcionario
    if (isChecked) {
      this.servicoOut.push(servico);
    } else {
      const index = this.servicoOut.indexOf(servico);
      this.servicoOut.splice(index, 1);
    }
    this.selecionado = true;
  }

  addServicos() {
    this.router.navigate(['sf'], {
      queryParams: { id: this.funcionario.id },
    });
  }
  voltarPagina() {
    window.history.back();
  }
}
