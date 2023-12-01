import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { ComponentCanDeactivate } from 'src/app/_services/prevent-leave.guard';

import { Record } from 'src/app/_interfaces/record';
import { Reservation } from 'src/app/_interfaces/reservation';
import { DatabaseService } from 'src/app/_services/database.service';

@Component({
  selector: 'app-survey',
  template: `
  <h1> WARNING: Complete Survey Before Continuing </h1>
  <form class="survey-form" [formGroup]="recordForm" (ngSubmit)="record()">
    <div>
      <label for="itemCond">Item Condition</label>
    </div>
    <div class="survey-radio">
      <label class="survey-label"> Completely Broken <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="1">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Mostly Broken <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="2">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Moderately Broken <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="3">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Somewhat Broken <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="4">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Slightly Broken <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="5">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Slightly Fine <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="6">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Somewhat Fine <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="7">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Moderately Fine <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="8">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Mostly Fine <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="9">
        <span class="survey-mark"></span>
      </label>
      <label class="survey-label"> Completely Fine <br>
        <input type="radio" formControlName="itemCond" name="itemCond" [value]="10">
        <span class="survey-mark"></span>
      </label>
    </div>
    <div>
      <label>Additional Comments <br>
        <textarea rows="5" cols="65" formControlName="comments" placeholder="comments"></textarea>
      </label>
    </div>    
    
    <button class="bubble-button" type="submit" [disabled]="recordForm.invalid"> Record </button>
  </form>
  `
})
export class SurveyComponent implements OnInit, OnDestroy, ComponentCanDeactivate{
  reservation$: Observable<Reservation> = new Observable();
  private rsrvSub: Subscription = new Subscription();
  private rcrdSub: Subscription = new Subscription();
  private deleteSub: Subscription = new Subscription();
  private emailSub: Subscription = new Subscription();
  private rsrvID: string | undefined = '';
  record$: Observable<Record> = new Observable();
  recordForm: FormGroup = new FormGroup({});
  surveyed: Boolean = false; 

  constructor(    
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService
) { }
  ngOnInit(): void {
    // get record specified
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.rsrvID = id?.toString();
    
    if (!id) alert('No id provided');
    else this.record$ = this.databaseService.getRecord(id);

    this.recordForm = this.formBuilder.group({
      itemCond: ['', Validators.required],
      comments: ['']
    });
  }
  ngOnDestroy(): void {
    this.rsrvSub.unsubscribe();
    this.rcrdSub.unsubscribe();
    this.deleteSub.unsubscribe();
    this.emailSub.unsubscribe();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.surveyed == true) return true;
    else return false;
  }

  record() {
    if (this.rsrvID != null) {
      // get reservation
      this.reservation$ = this.databaseService.getReservation(this.rsrvID);
      this.rsrvSub = this.reservation$.subscribe(rsrv => {
        // create record
        let record: Record = {
          rsrvtion: rsrv._id,
          itemName: rsrv.itemName,
          itemLock: rsrv.itemLock,
          userName: rsrv.userName,
          strtTime: rsrv.strtTime,
          stopTime: rsrv.stopTime,
          pickedUp: rsrv.pickedUp,
          itemCond: this.recordForm.get('itemCond')?.value,
          comments: this.recordForm.get('comments')?.value
        }

        if (rsrv.pickedUp == false) this.deleteSub = this.databaseService.deleteReservation(rsrv._id || '').subscribe();
        else this.sendMail(rsrv);

        this.surveyed = true;
        this.addRecord(record);
      });
    }
  }

  // create a new record
  addRecord(record: Record) {
    this.databaseService.createRecord(record)
      .subscribe({
        next: () => {
          this.router.navigate(['/customer/profile']);
        },
        error: (error) => {
          alert("Failed to create record");
          console.error(error);
        }
      });
  }

  sendMail(reserve: Reservation) {
    let req: any = { 
      userName: reserve.userName?.toString(),
      message: 'Your reservation for ' + reserve.itemName?.toString() + ' will expire on ' + this.parseTime(reserve.stopTime) +
            '. Click here to extend: http://10.13.86.178:4200/'
    };
    console.log(req);
    this.emailSub = this.databaseService.sendMail(req).subscribe();
  }

  // parse times 2022 11 01 1300
  parseTime(time: Number | undefined): String {
    let timeStr = time?.toString();
    let dateRgx = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;

    if (timeStr) {
      let dateSet: Date = new Date(timeStr.replace(dateRgx, '$1-$2-$3T$4:$5:00'));
      return dateSet.toLocaleString();
    } else return "Bad Date";
  }
}
