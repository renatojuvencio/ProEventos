import { Router, RouterModule } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {
  @Input()
  titulo!: string;
  @Input() iconClass = 'fa fa-user';
  @Input() subtitulo = 'desde 2023';
  @Input() botaoListar = false;
  constructor(private router : Router) { }

  ngOnInit(): void{
  }
  listar() :void{
    this.router.navigate([`/${this.titulo.toLocaleLowerCase()}/lista`])
  }
}
