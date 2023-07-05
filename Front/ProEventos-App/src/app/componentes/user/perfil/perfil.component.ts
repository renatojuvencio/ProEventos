import { ValidatorField } from './../../../helpers/ValidatorField';
import { TituloComponent } from './../../../shared/titulo/titulo.component';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner } from 'ngx-spinner';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  userUpdate = {} as UserUpdate
  constructor(
    public fb: FormBuilder,
    public accountService : AccountService,
    private router : Router,
    private toaster : ToastrService,
    private spinner : NgxSpinner
    ){}

  get f(): any {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
  }
  carregarUsuario() : void {
    this.accountService.getUser();
  }
  validation():void  {
    const formOption :  AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword')
    }
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      funcao: ['', Validators.required],
      descricao: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]]
    },formOption);
   }
   resetForm(): void{
    event?.preventDefault();
    this.form.reset();
   }
}
