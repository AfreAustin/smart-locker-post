import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

import { Record } from 'src/app/_interfaces/record';
import { Item } from 'src/app/_interfaces/item';
import { Account } from 'src/app/_interfaces/account';
import { DatabaseService } from 'src/app/_services/database.service';

@Component({
  selector: 'app-record-form',
  template: `
  <h2> Add a New Record </h2>
  
  <form class="forms" autocomplete="off" [formGroup]="recordForm" (ngSubmit)="submitForm()">
  <div>
      <label for="rsrvtion">Reservation ID</label>
      <input type="text" formControlName="rsrvtion" placeholder="rsrvtion" required>
  </div>

  <div>
      <label for="itemName">Item</label>
  </div>
  <div class="grid-hold">
      <div class="grid-item" *ngFor="let item of items$ | async">
      <label for="itemName"> {{item.itemName}} </label>
      <input type="radio" formControlName="itemName" name="itemName" id="itemName" [value]="item.itemName" required>
      </div>
  </div>

  <div>
      <label for="itemLock">Item Locker</label>
      <input type="text" formControlName="itemLock" placeholder="itemLock" required>
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
      <input type="datetime-local" formControlName="strtTime" placeholder="strtTime" required>
  </div>

  <div *ngIf="strtTime.invalid && (strtTime.dirty || strtTime.touched)">
      <div *ngIf="strtTime.errors?.['required']">
          Start Time is required.
      </div>
  </div>

  <div>
      <label for="stopTime">Stop Time</label>
      <input type="datetime-local" formControlName="stopTime" placeholder="stopTime" required>
  </div>

  <div *ngIf="stopTime.invalid && (stopTime.dirty || stopTime.touched)">
      <div *ngIf="stopTime.errors?.['required']">
          Stop Time is required.
      </div>
  </div>

  <div>
      <label for="pickedUp">Event? </label>
  </div>  
  <div>
      <label for="pickedUp">Pickup</label>
      <input type="radio" formControlName="pickedUp" name="pickedUp" [value]="true">
      <label for="pickedUp">Return</label>
      <input type="radio" formControlName="pickedUp" name="pickedUp" [value]="false">
  </div>

  <div>
      <label for="itemCond">Item Condition</label>
  </div>
  <div>
      <label for="itemCond">1</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="1">
      <label for="itemCond">2</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="2">
      <label for="itemCond">3</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="3">
      <label for="itemCond">4</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="4">
      <label for="itemCond">5</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="5">
      <label for="itemCond">6</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="6">
      <label for="itemCond">7</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="7">
      <label for="itemCond">8</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="8">
      <label for="itemCond">9</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="9">
      <label for="itemCond">10</label> <input type="radio" formControlName="itemCond" name="itemCond" [value]="10">
  </div>  

  <div>
      <label for="comments">Reservation ID</label>
      <input type="textbox" formControlName="comments" placeholder="comments" required>
  </div>

  <button type="submit" [disabled]="recordForm.invalid">Add</button>
  </form>
  ` 
})
export class RecordFormComponent implements OnInit {
  items$: Observable<Item[]> = new Observable();
  accounts$: Observable<Account[]> = new Observable();

  // initial state of form
  @Input()
  initialState: BehaviorSubject<Record> = new BehaviorSubject({});
  // emit form values during submissions
  @Output()
  formValuesChanged = new EventEmitter<Record>();
  @Output()
  formSubmitted = new EventEmitter<Record>();

  recordForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService) { }

  // get record details
  get rsrvtion() { return this.recordForm.get('rsrvtion')!; }
  get itemName() { return this.recordForm.get('itemName')!; }
  get itemLock() { return this.recordForm.get('itemLock')!;}
  get userName() { return this.recordForm.get('userName')!; }
  get strtTime() { return this.recordForm.get('strtTime')!; }
  get stopTime() { return this.recordForm.get('stopTime')!; }
  get pickedUp() { return this.recordForm.get('pickedUp')!; }
  get itemCond() { return this.recordForm.get('itemCond')!; }
  get comments() { return this.recordForm.get('comments')!; }
  
  // load current state of form
  ngOnInit() {
    this.fetchItems();
    this.fetchAccounts();

    // initial state of form
    this.initialState.subscribe(record => {
      this.recordForm = this.formBuilder.group({
        rsrvtion: [ record.rsrvtion, [Validators.required] ],
        itemName: [ record.itemName, [Validators.required, Validators.minLength(3)] ],
        itemLock: [ record.itemLock, [Validators.required] ],
        userName: [ record.userName, [Validators.required, Validators.minLength(3)] ],
        strtTime: [ record.strtTime, [Validators.required] ],
        stopTime: [ record.stopTime, [Validators.required] ],
        pickedUp: [ record.pickedUp, [Validators.required] ],
        itemCond: [ record.itemCond, [Validators.required] ],
        comments: [ record.comments, [Validators.required] ]
      });
    });

    // changed state of form
    this.recordForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  // emits values in form
  submitForm() { this.formSubmitted.emit(this.recordForm.value); }
  private fetchItems(): void { this.items$ = this.databaseService.getItems(); }
  private fetchAccounts(): void { this.accounts$ = this.databaseService.getAccounts(); }
}
