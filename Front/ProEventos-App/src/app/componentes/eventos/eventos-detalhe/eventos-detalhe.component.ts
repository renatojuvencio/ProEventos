import { AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { LoteService } from './../../../services/lote.service';
import { Lote } from './../../../models/Lote';
import { Evento } from './../../../models/Evento';
import { EventoService } from './../../../services/evento.service';

@Component({
  selector: 'app-eventos-detalhe',
  templateUrl: './eventos-detalhe.component.html',
  styleUrls: ['./eventos-detalhe.component.scss']
})
export class EventosDetalheComponent implements OnInit {
  eventoId: number;
  evento = {} as Evento;
  estadoSalvar = 'post';
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  get modoEditar(): boolean{
    return this.estadoSalvar === 'put';
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
    private actvatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private router: Router,
    private loteService: LoteService
    ) {
    this.localeService.use('pt-br');
  }
  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public carregarEvento(): void {
    this.eventoId = +this.actvatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId != null || this.eventoId=== 0){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+this.eventoId).subscribe(
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
        lotes: this.fb.array([])
      }
    );
  }

  adicionarLote() :void{
    return this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote : Lote): FormGroup{
    return this.fb.group({
      id: [lote.id],
      nome:  [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    })
  }

  public resetForm(): void {
    this.form.reset();
  }
  public cssValidator(campo: FormControl | AbstractControl): any {
    return { 'is-invalid': campo.errors && campo.touched }
  }

  public salvarAlteracao(): void{
    this.spinner.show();

    if(this.form.valid){

      this.estadoSalvar === 'post'? this.evento = {...this.form.value}  : this.evento = {id: this.evento.id, ...this.form.value};

        this.eventoService[this.estadoSalvar](this.evento).subscribe(

          (eventoRetorno: Evento) =>
          {
            this.toaster.success('Evento salvo com sucesso!', 'Sucesso');
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
          },

          (error: any) => {
            console.log(error);
            this.spinner.hide(),
            this.toaster.error('Erro ao salvar o evento!', 'Erro')
          },

          () => this.spinner.hide()
        );
    }
  }
  public salvarLotes(): void{
    this.spinner.show();
    if(this.form.controls['lotes'].valid)
    {
      this.spinner.hide();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
      .subscribe(
        () => {
          this.toaster.success('Lotes salvos com sucesso!', 'Sucesso!')
          this.lotes.reset();
        },
        () => {}
      ).add(() => this.spinner.hide())
    }
  }
}
