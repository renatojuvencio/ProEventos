import { ValidatorField } from './../../../helpers/ValidatorField';
import { TituloComponent } from './../../../shared/titulo/titulo.component';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;

  constructor(public fb: FormBuilder){}

  get f(): any {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.validation();
  }
  validation():void  {
    const formOption :  AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmSenha')
    }
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      funcao: ['', Validators.required],
      descricao: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmSenha: ['', [Validators.required]]
    },formOption);
   }
   resetForm(): void{
    event?.preventDefault();
    this.form.reset();
   }
}
