import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

import { Reservation } from 'src/app/_interfaces/reservation';
import { Item } from 'src/app/_interfaces/item';
import { Account } from 'src/app/_interfaces/account';
import { DatabaseService } from 'src/app/_services/database.service';

@Component({
  selector: 'app-reservation-form',
  template: `
  <h2> Add a New Reservation </h2>

  <form class="forms" autocomplete="off" [formGroup]="reservationForm" (ngSubmit)="submitForm()">
    <div>
      <label for="itemName">Item</label>
    </div>
    <div class="grid-hold">
      <div class="grid-item" *ngFor="let item of items$ | async">
        <label for="itemName"> {{item.itemName}} </label>
        <input type="radio" formControlName="itemName" name="itemName" id="itemName" [value]="item.itemName" required>
        <p> Locker {{ item.itemLock }} </p>
      </div>
    </div>

    <div>
      <label for="userName">Account</label>
    </div>
    <div class="grid-hold">
      <div class="grid-item" *ngFor="let account of accounts$ | async">
        <label for="userName"> {{account.userName}} </label>
        <input type="radio" formControlName="userName" name="userName" id="userName" [value]="account.userName">
      </div>
    </div>

    <div>
        <label for="strtTime">Start Time</label>
        <input class="input-dt-local" type="datetime-local" formControlName="strtTime" placeholder="strtTime" required>
    </div>

    <div *ngIf="strtTime.invalid && (strtTime.dirty || strtTime.touched)">
        <div *ngIf="strtTime.errors?.['required']">
          Start Time is required.
        </div>
    </div>

    <div>
        <label for="stopTime">Stop Time</label>
        <input class="input-dt-local" type="datetime-local" formControlName="stopTime" placeholder="stopTime" required>
    </div>

    <div *ngIf="stopTime.invalid && (stopTime.dirty || stopTime.touched)">
        <div *ngIf="stopTime.errors?.['required']">
          Stop Time is required.
        </div>
    </div>

    <div>
      <label for="pickedUp">Picked Up</label>
      <input type="hidden" formControlName="pickedUp" name="pickedUp" id="pickedUp" value="false">
    </div>

    <button type="submit" [disabled]="reservationForm.invalid">Add</button>
  </form>
  `
})
export class ReservationFormComponent implements OnInit {
  items$: Observable<Item[]> = new Observable();
  accounts$: Observable<Account[]> = new Observable();

  // initial state of form
  @Input()
  initialState: BehaviorSubject<Reservation> = new BehaviorSubject({});
  // emit form values during submissions
  @Output()
  formValuesChanged = new EventEmitter<Reservation>();
  @Output()
  formSubmitted = new EventEmitter<Reservation>();

  reservationForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService) { }

  // get reservation details
  get itemName() { return this.reservationForm.get('itemName')!; }
  get itemLock() { return this.reservationForm.get('itemLock')!;}
  get userName() { return this.reservationForm.get('userName')!; }
  get strtTime() { return this.reservationForm.get('strtTime')!; }
  get stopTime() { return this.reservationForm.get('stopTime')!; }
  get pickedUp() { return this.reservationForm.get('pickedUp')!; }
  
  // load current state of form
  ngOnInit() {
    this.fetchItems();
    this.fetchAccounts();

    // initial state of form
    this.initialState.subscribe(reservation => {
      this.reservationForm = this.fb.group({
        itemName: [ reservation.itemName, [Validators.required, Validators.minLength(3)] ],
        itemLock: [ reservation.itemLock, [Validators.required ] ],
        userName: [ reservation.userName, [Validators.required, Validators.minLength(3)] ],
        strtTime: [ reservation.strtTime, [Validators.required] ],
        stopTime: [ reservation.stopTime, [Validators.required] ],
        pickedUp: [ reservation.pickedUp, [Validators.required] ]
      });
    });

    // changed state of form
    this.reservationForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  // emits values in form
  submitForm() {
    this.formSubmitted.emit(this.reservationForm.value);
  }

  private fetchItems(): void { this.items$ = this.databaseService.getItems(); }
  private fetchAccounts(): void { this.accounts$ = this.databaseService.getAccounts(); }
}
