import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Servico } from 'src/app/models/servico';
import { AppSettings } from 'src/app/shared/appSettings';
import { Observable } from 'rxjs';
import { Escala } from 'src/app/models/escala';
import { ServicoFuncionario } from 'src/app/models/servico-funcionario';

@Injectable({
  providedIn: 'root',
})
export class ServicoEscalaFormService {
  emitirServicos = new EventEmitter<Servico[]>();

  constructor(protected http: HttpClient) { }

  emiteServicoEatapa2(servicoFuncionario: Servico[]): void {
    this.emitirServicos.emit(servicoFuncionario);
  }

  getServicoFuncionario(idServico: number): Observable<ServicoFuncionario> {
    return this.http.get<ServicoFuncionario>(
      AppSettings.url + '/api/servico/funcionario/servico/' + idServico
    );
  }
  // lista de escalas pro serviço funcionario
  listEscalasServico(idServicoFuncionario): Observable<Escala[]> {
    return this.http.get<Array<Escala>>(
      AppSettings.url + '/api/escala/servicofuncionario/' + idServicoFuncionario
    );
  }
  listEscalasFuncionario(idFuncionario: number, idsServicos: number[]): Observable<Escala[][]> {
    let parametros = new HttpParams();
    parametros = parametros.set('funcionario', idFuncionario.toString());
    idsServicos.forEach(
      (e) => (parametros = parametros.append('servico', e.toString()))
    );
    return this.http.get<Array<Escala[]>>(
      AppSettings.url + '/api/escala/servicofuncionario',
      { params: parametros }
    );
  }
}
