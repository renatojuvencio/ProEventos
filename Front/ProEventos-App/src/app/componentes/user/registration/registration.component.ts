import { AccountService } from './../../../services/account.service';
import { ValidatorField } from './../../../helpers/ValidatorField';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User } from '@app/models/identity/User';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  user = {} as User;

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toaster: ToastrService){}

  get f(): any {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.validation();
  }
  validation():void  {
    const formOption :  AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmPassword')
    }
    this.form = this.fb.group({
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]]
    }, formOption);
  }

  public register():void{
    this.user = { ...this.form.value};
    this.accountService.register(this.user).subscribe(
      () => {this.router.navigateByUrl('/dashboard')},
      (error: any) => {this.toaster.error(error.error)}
    );
  }
}
