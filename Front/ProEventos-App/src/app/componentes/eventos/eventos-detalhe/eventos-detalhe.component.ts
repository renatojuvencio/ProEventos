import { environment } from './../../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AbstractControl } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
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
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  estadoSalvar = 'post';
  form!: FormGroup;
  loteAtual = {id: 0, nome: '', index: 0};
  imagemURL = 'assets/upload.jpg';
  file : File;

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

  get bsConfigLote(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
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
    private loteService: LoteService,
    private modalService: BsModalService
    ) {
    this.localeService.use('pt-br');
  }
  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public carregarEvento(): void {
    this.eventoId = +this.actvatedRouter.snapshot.paramMap.get('id');

    if(this.eventoId != null && this.eventoId != 0){
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+this.eventoId).subscribe(
        (evento: Evento)  => {
            this.evento = {...evento},
            this.form.patchValue(this.evento);
            if(this.evento.imagemURL != ''){
              this.imagemURL = environment.apiUrl +'resources/images/'+ this.evento.imagemURL;
            }
            this.carregarLotes();
          },
          (error: any) => {
            this.toaster.error('Erro ao tentar carregar evento!', 'Erro!');
            console.error(error);
          }
      ).add(() => this.spinner.hide());
    }
  }

  public carregarLotes(): void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno : Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        })
      },
      (error: any) => {
        this.toaster.error('Erro ao tentar carregar lotes!', 'Erro!');
        console.error(error);
      }
    ).add(() => this.spinner.hide());
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
        imagemURL: [''],
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
    if(this.form.controls['lotes'].valid)
    {
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
      .subscribe(
        () => {
          this.toaster.success('Lotes salvos com sucesso!', 'Sucesso!')
          this.lotes.reset();
        },
        (error: any) => {
          this.toaster.error('Erro ao tentar salvar lotes', 'Erro');
          console.error(error);
        }
      ).add(() => this.spinner.hide())
    }
  }

  public removerLote(template: TemplateRef<any>, index: number): void{
    this.loteAtual.id = this.lotes.get(index + '.id').value;
    this.loteAtual.nome = this.lotes.get(index + '.nome').value;
    this.loteAtual.index = index;

    this.modalRef = this.modalService.show(template, {class:'modal-sm'});
  }

  confirmDeleteLote(): void{
    this.modalRef.hide();
    this.spinner.show();
    this.loteService.delete(this.eventoId, this.loteAtual.id).subscribe(
      () => {
        this.toaster.success('Lote deletado com sucesso', 'Sucesso');
        this.lotes.removeAt(this.loteAtual.index);
      },
      (error: any) => {
        this.toaster.error(`Erro ao tentar deletar o lote ${this.loteAtual.nome}`, 'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide())
  }
  declineDeleteLote(): void{
    this.modalRef.hide();
  }

  public mudarValorData(value : Date, index: number, campo: string) : void{
    this.lotes.value[index]['campo'] = value;
  }

  public retornaTituloLote(nome: string) : string{
    return nome === null ||  nome == ''? 'Nome do lote' : nome;
  }

  public onFileChange(ev : any) : void{
    const reader = new FileReader();
    reader.onload = (event : any) => this.imagemURL = event.target.result;
    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);
    this.uploadImagem();
  }

  uploadImagem(): void{
    this.spinner.show();
    this.eventoService.postUpload(this.eventoId, this.file).subscribe(
      () => {
        this.carregarEvento();
        this.toaster.success('Imagem atualizado com sucesso!', 'Sucesso!');
      },
      (error: any) => {
        this.toaster.error('Erro ao fazer upload de imagem', 'Erro!'),
        console.log(error);
      }
    ).add(() => this.spinner.hide())
  }
}
