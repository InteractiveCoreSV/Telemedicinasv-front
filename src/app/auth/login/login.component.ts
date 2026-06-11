import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  formSubmited: boolean = false;
  showPassword: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authService:AuthService, 
              private router: Router
              ) { }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      emailOrUserName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  getEmailErrorMessage() {
    const email = this.loginForm.get('emailOrUserName');
    if (email?.hasError('required')) {
      return 'El correo o nombre de usuario es requerido'
    }
    return ''
  }

  getPasswordErrorMessage() {
    const password = this.loginForm.get('password');
    if (password?.hasError('required')) {
      return 'La contraseña es requerida'
    }
    return ''
  }

  login() {
    this.formSubmited = true;
    if (this.loginForm.valid) {
      this.authService.logIn(this.loginForm.value.emailOrUserName,this.loginForm.value.password);
    }
  }
}
