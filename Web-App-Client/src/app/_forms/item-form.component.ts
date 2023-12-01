import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

import { Item } from 'src/app/_interfaces/item';
import { Locker } from 'src/app/_interfaces/locker';
import { DatabaseService } from 'src/app/_services/database.service';

@Component({
  selector: 'app-item-form',
  template: `
  <h2> Add a New Item </h2>
  <form class="forms" autocomplete="off" [formGroup]="itemForm" (ngSubmit)="submitForm()">
    <div>
      <label for="itemFree"> Available? </label>
      <div>
        <label for="itemFree-true">Yes</label>
        <input type="radio" formControlName="itemFree" name="itemFree" id="itemFree-true" [value]="true">
      </div>
      <div>
        <label for="itemFree-false">No</label>
        <input type="radio" formControlName="itemFree" name="itemFree" id="itemFree-false" [value]="false">
      </div>
    </div>

    <div>
      <label for="itemName">Item Name</label>
      <input type="text" id="itemName" formControlName="itemName" placeholder="ItemName" required>
    </div>

    <div *ngIf="itemName.invalid && (itemName.dirty || itemName.touched)">
      <div *ngIf="itemName.errors?.['required']">
        Item Name is required.
      </div>
      <div *ngIf="itemName.errors?.['minlength']">
        Item Name must be at least 3 characters long.
      </div>
    </div>
    
    <div>
      <label for="itemLock">Locker</label>
    </div>
    <div class="grid-hold">
      <div class="grid-item" *ngFor="let locker of lockers$ | async">
          <label for="itemLock"> {{locker.lockName}} </label>
          <input type="radio" formControlName="itemLock" name="itemLock" id="itemLock" [value]="locker.lockName">
      </div>
    </div>

    <div>
      <label for="itemDesc">Description</label>
      <input type="text" formControlName="itemDesc" placeholder="ItemDesc" required>
    </div>

    <div *ngIf="itemDesc.invalid && (itemDesc.dirty || itemDesc.touched)">
      <div *ngIf="itemDesc.errors?.['required']">
        Item Description is required.
      </div>
      <div *ngIf="itemDesc.errors?.['minlength']">
        Item Description must be at least 3 characters long.
      </div>
    </div>

    <div>
      <label for="itemReqs">Requirements</label>
      <select id="itemReqs" formControlName="itemReqs">
        <option value="none"> None </option>
        <option value="some"> Some </option>
      </select>
    </div>

    <br>

    <div>
      <label for="itemIcon"> Icon </label>
    </div>
    <div class="grid-hold">
      <div class="grid-item">
        <label for="itemIcon-1"> <img src="assets/item-icons/drill.svg" width="30"> </label>
        <input type="radio" formControlName="itemIcon" name="itemIcon" id="itemIcon-1" value="assets/item-icons/drill.svg">
      </div>
      <div class="grid-item">
        <label for="itemIcon-2"> <img src="assets/item-icons/hammer-claw.svg" width="30"> </label>
        <input type="radio" formControlName="itemIcon" name="itemIcon" id="itemIcon-2" value="assets/item-icons/hammer-claw.svg">
      </div>
      <div class="grid-item">
        <label for="itemIcon-3"> <img src="assets/item-icons/plier-channellock.svg" width="30"> </label>
        <input type="radio" formControlName="itemIcon" name="itemIcon" id="itemIcon-3" value="assets/item-icons/plier-channellock.svg">
      </div>
      <div class="grid-item">
        <label for="itemIcon-4"> <img src="assets/item-icons/plier-needlenose.svg" width="30"> </label>
        <input type="radio" formControlName="itemIcon" name="itemIcon" id="itemIcon-4" value="assets/item-icons/plier-needlenose.svg">
      </div>
      <div class="grid-item">
        <label for="itemIcon-5"> <img src="assets/item-icons/saw-circular.svg" width="30"> </label>
        <input type="radio" formControlName="itemIcon" name="itemIcon" id="itemIcon-5" value="assets/item-icons/saw-circular.svg">
      </div>
      <div class="grid-item">
        <label for="itemIcon-6"> <img src="assets/item-icons/screwdriver-flathead.svg" width="30"> </label>
        <input type="radio" formControlName="itemIcon" name="itemIcon" id="itemIcon-6" value="assets/item-icons/screwdriver-flathead.svg">
      </div>
      <div class="grid-item">
        <label for="itemIcon-7"> <img src="assets/item-icons/wrench-adjustable.svg" width="30"> </label>
        <input type="radio" formControlName="itemIcon" name="itemIcon" id="itemIcon-7" value="assets/item-icons/wrench-adjustable.svg">
      </div>
    </div>

    <button type="submit" [disabled]="itemForm.invalid">Add</button>
  </form>
  `
})
export class ItemFormComponent implements OnInit {
  lockers$: Observable<Locker[]> = new Observable();

  // initial state of form
  @Input()
  initialState: BehaviorSubject<Item> = new BehaviorSubject({});
  // emit form values during submissions
  @Output()
  formValuesChanged = new EventEmitter<Item>();
  @Output()
  formSubmitted = new EventEmitter<Item>();

  itemForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private databaseService: DatabaseService) { }

  // get item details
  get itemName() { return this.itemForm.get('itemName')!; }
  get itemDesc() { return this.itemForm.get('itemDesc')!; }
  get itemIcon() { return this.itemForm.get('itemIcon')!; }
  get itemLock() { return this.itemForm.get('itemLock')!; }
  get itemReqs() { return this.itemForm.get('itemReqs')!; }
  get itemFree() { return this.itemForm.get('itemFree')!; }

  // load current state of form
  ngOnInit() {
    this.fetchLockers();

    // initial state of form
    this.initialState.subscribe(item => {
      this.itemForm = this.fb.group({
        itemName: [ item.itemName, [Validators.required, Validators.minLength(3)] ],
        itemDesc: [ item.itemDesc, [Validators.required, Validators.minLength(3)] ],
        itemIcon: [ item.itemIcon, [Validators.required, Validators.minLength(3)] ],
        itemLock: [ item.itemLock, [Validators.required ] ],
        itemReqs: [ item.itemReqs, [Validators.required, Validators.minLength(3)] ],
        itemFree: [ item.itemFree, [Validators.required] ]
      });
    });

    // changed state of form
    this.itemForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  // emits values in form
  submitForm() {
    this.formSubmitted.emit(this.itemForm.value);
  }

  private fetchLockers(): void {
    this.lockers$ = this.databaseService.getLockers();
  }
}