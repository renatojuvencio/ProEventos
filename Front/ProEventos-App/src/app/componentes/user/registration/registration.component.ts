import { ValidatorField } from './../../../helpers/ValidatorField';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
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
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmSenha: ['', [Validators.required]]
    }, formOption);
  }
}
