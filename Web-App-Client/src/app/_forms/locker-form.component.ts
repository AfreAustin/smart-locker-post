import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { Locker } from '../_interfaces/locker';

@Component({
  selector: 'app-locker-form',
  template: `
  <h2> Add a New Locker </h2>
  
  <form class="forms" autocomplete="off" [formGroup]="lockerForm" (ngSubmit)="submitForm()">
    <div>
      <label for="lockName">Locker Name</label>
      <input type="text" id="lockName" formControlName="lockName" placeholder="LockName" required>
    </div>

    <div *ngIf="lockName.invalid && (lockName.dirty || lockName.touched)">
      <div *ngIf="lockName.errors?.['required']">
        Locker Name is required.
      </div>
      <div *ngIf="lockName.errors?.['minlength']">
        Locker Name must be at least 3 characters long.
      </div>
    </div>

    <div>
      <label for="lastOpen">Last Opened</label>
      <input type="text" formControlName="lastOpen" placeholder="lastOpen" required>
    </div>

    <div *ngIf="lastOpen.invalid && (lastOpen.dirty || lastOpen.touched)">
      <div *ngIf="lastOpen.errors?.['required']">
        Last Opened is required.
      </div>
      <div *ngIf="lastOpen.errors?.['minlength']">
        Last Opened must be at least 3 characters long.
      </div>
    </div>

    <div>
        <label for="lastShut">Last Closed</label>
        <input type="text" formControlName="lastShut" placeholder="lastShut" required>
    </div>

    <div *ngIf="lastShut.invalid && (lastShut.dirty || lastShut.touched)">
        <div *ngIf="lastShut.errors?.['required']">
          Last Closed is required.
        </div>
        <div *ngIf="lastShut.errors?.['minlength']">
          Last Closed must be at least 3 characters long.
        </div>
    </div>

    <button type="submit" [disabled]="lockerForm.invalid">Add</button>
  </form>
  ` 
})
export class LockerFormComponent implements OnInit {
  // initial state of form
  @Input()
  initialState: BehaviorSubject<Locker> = new BehaviorSubject({});
  // emit form values during submissions
  @Output()
  formValuesChanged = new EventEmitter<Locker>();
  @Output()
  formSubmitted = new EventEmitter<Locker>();

  lockerForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  // get locker details
  get lockName() { return this.lockerForm.get('lockName')!; }
  get lastOpen() { return this.lockerForm.get('lastOpen')!; }
  get lastShut() { return this.lockerForm.get('lastShut')!; }

  // load current state of form
  ngOnInit() {
    // initial state of form
    this.initialState.subscribe(locker => {
      this.lockerForm = this.fb.group({
        lockName: [ locker.lockName, [Validators.required ] ],
        lastOpen: [ locker.lastOpen, [Validators.required, Validators.minLength(3)] ],
        lastShut: [ locker.lastShut, [Validators.required, Validators.minLength(3)] ]
      });
    });

    // changed state of form
    this.lockerForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  // emits values in form
  submitForm() {
    this.formSubmitted.emit(this.lockerForm.value);
  }
}
