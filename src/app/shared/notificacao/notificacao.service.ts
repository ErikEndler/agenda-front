import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificacaoComponent } from './notificacao/notificacao.component';
import { Injectable } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificacaoService {
  constructor(
    private notification: NotificationsService,
    private formBuilder: FormBuilder
  ) {}
  form: FormGroup;

  public criar(
    tipo: NotificationType,
    titulo: string,
    msg?: string,
    tempo: number = 20000
  ): void {
    this.form = this.formBuilder.group({
      type: tipo,
      title: titulo,
      content: msg,
      timeOut: tempo,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      animate: 'fromRight',
    });
    const temp = this.form.getRawValue();
    console.log(temp);
    const title = temp.title;
    const content = temp.content;
    const type = temp.type;

    delete temp.title;
    delete temp.content;
    delete temp.type;

    this.notification.create(title, content, type, temp);
  }
}
