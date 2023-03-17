import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from './../../../models/Evento';
import { EventoService } from './../../../services/evento.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.scss']
})
export class EventosDetalheComponent implements OnInit {
  evento = {} as Evento;
  estadoSalvar = 'post';
  form!: FormGroup;
  get f(): any {
    return this.form.controls;
  }
  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false
    }
  }
  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService) {
    this.localeService.use('pt-br');
  }
  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if(eventoIdParam != null){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento)  => {
            this.evento = {...evento},
            this.form.patchValue(this.evento);
          },
          (error: any) => {
            this.spinner.hide();
            this.toaster.error('Erro ao tentar carregar evento!', 'Erro!');
            console.error(error);
          },
          () => this.spinner.hide(),
      );
    }
  }

  public validation(): void {
    this.form = this.fb.group(
      {
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        imagemURL: ['', Validators.required],
      }
    );
  }
  public resetForm(): void {
    this.form.reset();
  }
  public cssValidator(campo: FormControl): any {
    return { 'is-invalid': campo.errors && campo.touched }
  }

  public salvarAlteracao(): void{
    this.spinner.show();

    if(this.form.valid){

      this.estadoSalvar === 'post'? this.evento = {...this.form.value}  : this.evento = {id: this.evento.id, ...this.form.value};

        this.eventoService[this.estadoSalvar](this.evento).subscribe(

          () => this.toaster.success('Evento salvo com sucesso!', 'Sucesso'),

          (error: any) => {
            console.log(error);
            this.spinner.hide(),
            this.toaster.error('Erro ao salvar o evento!', 'Erro')
          },

          () => this.spinner.hide()
        );
    }
  }
}
