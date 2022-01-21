import { Component, OnInit } from '@angular/core';
import { Evento } from '../models/Evento';
import { EventoService } from '../services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {


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

  constructor(private eventoService: EventoService) { }

  public ngOnInit(): void {
    this.getEventos();
  }

  public alterarImagem() : void{
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos (): void{
    this.eventoService.getEventos().subscribe(
    (_eventos : Evento[]) => {
      this.eventos = _eventos,
      this.eventosFiltrados = _eventos
    },
    error => console.log(error));
  }
}
