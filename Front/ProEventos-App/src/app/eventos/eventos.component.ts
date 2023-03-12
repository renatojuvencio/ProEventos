import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  modalRef?: BsModalRef;
  public eventos : Evento[] = [];
  public eventosFiltrados : Evento[] = [];


  public larguraImagem: number = 150;
  public margemImagem: number = 2;
  public exibirImagem = true;

  private _filtroLista : string = '';

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
    private toastr: ToastrService
    ) { }

  public ngOnInit(): void {
    this.getEventos();
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
        error: (error: any) => console.log(error)
      }
    )
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('O evento foi deletado com sucesso!', 'Deletado!');
  }
 
  decline(): void {
    this.modalRef?.hide();
  }
}
