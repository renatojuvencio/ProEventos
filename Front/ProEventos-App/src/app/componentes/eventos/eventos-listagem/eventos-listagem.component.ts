import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from './../../../services/evento.service';
import { Evento } from './../../../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-eventos-listagem',
  templateUrl: './eventos-listagem.component.html',
  styleUrls: ['./eventos-listagem.component.scss']
})
export class EventosListagemComponent {
  modalRef?: BsModalRef;
  public eventos : Evento[] = [];
  public eventosFiltrados : Evento[] = [];


  public larguraImagem: number = 150;
  public margemImagem: number = 2;
  public exibirImagem = true;

  private _filtroLista : string = '';
  eventoId: number;

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value : string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos (this.filtroLista) : this.eventos;
  }

  public filtrarEventos (filtrarPor : string) : Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (      evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor)!== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor)!== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router : Router
    ) { }

  public ngOnInit(): void {
    this.getEventos();
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }

  public alterarImagem() : void{
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos (): void{
    this.eventoService.getEventos().subscribe(
      {
        next: (_eventos : Evento[]) => {
          this.eventos = _eventos,
          this.eventosFiltrados = _eventos
        },
        error: (error: any) => {
          complete: () => this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos!', 'Erro!');
        },
        complete: () => this.spinner.hide()
      }
    )
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number) {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.spinner.show();
    this.eventoService.delete(this.eventoId).subscribe(
      (result: any) => {
        if(result.message === 'Deletado'){
          console.log(result)
          this.toastr.success('O evento foi deletado com sucesso!', 'Deletado!');
          this.getEventos();
        }
      },
      (error: any) => {
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
        console.error(error);
      }
    ).add(() => this.spinner.hide())
    this.modalRef?.hide();
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id : number) : void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
