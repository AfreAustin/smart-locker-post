import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { Account } from '../_interfaces/account'; 

@Component({
  selector: 'app-account-form',
  template: `
  <h2> Add a New Account </h2>

  <form class="forms" autocomplete="off" [formGroup]="accountForm" (ngSubmit)="submitForm()">
    <div>
      <label for="userName">Username</label>
      <input type="email" id="userName" formControlName="userName" placeholder="Username" required>
    </div>

    <div *ngIf="userName.invalid && (userName.dirty || userName.touched)">
      <div *ngIf="userName.errors?.['required']">
        Username is required.
      </div>
      <div *ngIf="userName.errors?.['minlength']">
        Username must be at least 3 characters long.
      </div>
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" formControlName="password" placeholder="Password" required>
    </div>

    <div *ngIf="password.invalid && (password.dirty || password.touched)">
      <div *ngIf="password.errors?.['required']">
        Password is required.
      </div>
      <div *ngIf="password.errors?.['minlength']">
        Password must be at least 5 characters long.
      </div>
    </div>

    <div>
      <div>
        <label for="userType-manager">Manager</label>
        <input type="radio" formControlName="userType" name="userType" id="userType-manager" value="manager">
      </div>
      <div>
        <label for="userType-customer">Customer</label>
        <input type="radio" formControlName="userType" name="userType" id="userType-customer" value="customer">
      </div>
    </div>

    <div>
      <label for="foreName">First Name</label>
      <input type="text" id="foreName" formControlName="foreName" placeholder="foreName" required>
    </div>

    <div *ngIf="foreName.invalid && (foreName.dirty || foreName.touched)">
      <div *ngIf="foreName.errors?.['required']">
        First Name is required.
      </div>
      <div *ngIf="foreName.errors?.['minlength']">
        First Name must be at least 1 character long.
      </div>
    </div>

    <div>
      <label for="lastName">Last Name</label>
      <input type="text" id="lastName" formControlName="lastName" placeholder="lastName" required>
    </div>

    <div *ngIf="lastName.invalid && (lastName.dirty || lastName.touched)">
      <div *ngIf="lastName.errors?.['required']">
        Last Name is required.
      </div>
      <div *ngIf="lastName.errors?.['minlength']">
        Last Name must be at least 1 character long.
      </div>
    </div>

    <div>
      <label for="userRFID">RFID</label>
      <input type="text" id="userRFID" formControlName="userRFID" placeholder="userRFID" required>
    </div>

    <div *ngIf="userRFID.invalid && (userRFID.dirty || userRFID.touched)">
      <div *ngIf="userRFID.errors?.['required']">
        RFID is required.
      </div>
      <div *ngIf="userRFID.errors?.['minlength']">
        RFID must be at least 1 character long.
      </div>
    </div>

    <button type="submit" [disabled]="accountForm.invalid">Add</button>
  </form>
  `
})
export class AccountFormComponent implements OnInit {
  // initial state of form
  @Input()
  initialState: BehaviorSubject<Account> = new BehaviorSubject({});
  // emit form values during submissions
  @Output()
  formValuesChanged = new EventEmitter<Account>();
  @Output()
  formSubmitted = new EventEmitter<Account>();

  accountForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  // get account details
  get userName() { return this.accountForm.get('userName')!; }
  get password() { return this.accountForm.get('password')!; }
  get userType() { return this.accountForm.get('userType')!; }
  get userRFID() { return this.accountForm.get('userRFID')!; }
  get foreName() { return this.accountForm.get('foreName')!; }
  get lastName() { return this.accountForm.get('lastName')!; }

  // load current state of form
  ngOnInit() {
    // initial state of form
    this.initialState.subscribe(account => {
      this.accountForm = this.fb.group({
        userName: [ account.userName, [Validators.required, Validators.minLength(3)] ],
        password: [ account.password, [Validators.required, Validators.minLength(5)] ],
        userType: [ account.userType, [Validators.required] ],
        userRFID: [ account.userRFID, [Validators.required, Validators.minLength(5)] ],
        foreName: [ account.foreName, [Validators.required, Validators.minLength(1)] ],
        lastName: [ account.lastName, [Validators.required, Validators.minLength(1)] ]
      });
    });

    // changed state of form
    this.accountForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  // emits values in form
  submitForm() {
    this.formSubmitted.emit(this.accountForm.value);
  }
}