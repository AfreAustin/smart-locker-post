import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { DatabaseService } from '../_services/database.service';
import { Account } from 'src/app/_interfaces/account';
import { Item } from 'src/app/_interfaces/item';
import { Locker } from 'src/app/_interfaces/locker';
import { Record } from 'src/app/_interfaces/record';
import { Reservation } from 'src/app/_interfaces/reservation';

@Component({
  selector: 'app-manager-home',
  template: `
  <h1> Admin: {{ custName }} </h1>
  <div>
    | <button [ngClass]="{'admin-tab-selected' : dataSrcTab == 'acct', 'admin-tab' : dataSrcTab != 'acct'}" (click)="changeTableDataSrc('acct')"> Accounts </button>
    | <button [ngClass]="{'admin-tab-selected' : dataSrcTab == 'item', 'admin-tab' : dataSrcTab != 'item'}" (click)="changeTableDataSrc('item')"> Items </button>
    | <button [ngClass]="{'admin-tab-selected' : dataSrcTab == 'lock', 'admin-tab' : dataSrcTab != 'lock'}" (click)="changeTableDataSrc('lock')"> Lockers </button>
    | <button [ngClass]="{'admin-tab-selected' : dataSrcTab == 'rcrd', 'admin-tab' : dataSrcTab != 'rcrd'}" (click)="changeTableDataSrc('rcrd')"> Records </button>
    | <button [ngClass]="{'admin-tab-selected' : dataSrcTab == 'rsrv', 'admin-tab' : dataSrcTab != 'rsrv'}" (click)="changeTableDataSrc('rsrv')"> Reservations </button>

    <mat-table [dataSource]="dataSource" class="mat-elevation-z8" matSort>
      <!-- #region Account Data -->
      <ng-container matColumnDef="userActs">
        <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
        <mat-cell *matCellDef="let account">
          &nbsp; <a [routerLink]="['../edit/acct/', account._id]">Edit</a>
          &nbsp; <a (click)="deleteAcct(account._id || '')">Delete</a>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="userName">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Email </mat-header-cell>
        <mat-cell *matCellDef="let account"> <p> {{account.userName}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="userType">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Type </mat-header-cell>
        <mat-cell *matCellDef="let account"> <p> {{account.userType}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="lastName">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Name </mat-header-cell>
        <mat-cell *matCellDef="let account"> <p> {{account.lastName + ', ' + account.foreName }} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="userRFID">
        <mat-header-cell *matHeaderCellDef mat-sort-header> RFID </mat-header-cell>
        <mat-cell *matCellDef="let account"> <p> {{account.userRFID}} </p> </mat-cell>
      </ng-container>
      <!-- #endregion -->

      <!-- #region Item Data -->
      <ng-container matColumnDef="itemActs">
        <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
        <mat-cell *matCellDef="let item">
          &nbsp; <a [routerLink]="['../edit/item/', item._id]">Edit</a> &nbsp;
          &nbsp; <a (click)="deleteItem(item._id || '')">Delete</a>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="itemFree">
        <mat-header-cell *matHeaderCellDef mat-sort-header> FREE </mat-header-cell>
        <mat-cell *matCellDef="let item"> <p> {{item.itemFree == true ? 'Y' : 'N'}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="itemIcon">
        <mat-header-cell *matHeaderCellDef> Icon </mat-header-cell>
        <mat-cell *matCellDef="let item"> <img [src]="item.itemIcon" style="height:30px"> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="itemName">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Name </mat-header-cell>
        <mat-cell *matCellDef="let item"> <p> {{item.itemName}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="itemLock">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Locker </mat-header-cell>
        <mat-cell *matCellDef="let item"> <p> {{item.itemLock}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="itemDesc">
        <mat-header-cell *matHeaderCellDef> Description </mat-header-cell>
        <mat-cell *matCellDef="let item"> <p> {{item.itemDesc}} </p> </mat-cell>
      </ng-container>

      <!-- #endregion -->

      <!-- #region Locker Data -->
      <ng-container matColumnDef="lockActs">
        <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
        <mat-cell *matCellDef="let lock">
          &nbsp; <a [routerLink]="['../edit/lock/', lock._id]">Edit</a> &nbsp;
          &nbsp; <a (click)="deleteLock(lock._id || '')">Delete</a>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="lockName">
        &nbsp; <mat-header-cell *matHeaderCellDef mat-sort-header> Name </mat-header-cell>
        &nbsp; <mat-cell *matCellDef="let lock"> <p> {{lock.lockName}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="lockOpen">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Last Opened </mat-header-cell>
        <mat-cell *matCellDef="let lock"> <p> {{lock.lastOpen}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="lockShut">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Last Closed </mat-header-cell>
        <mat-cell *matCellDef="let lock"> <p> {{lock.lastShut}} </p> </mat-cell>
      </ng-container>
      <!-- #endregion -->

      <!-- #region Record Data -->
      <ng-container matColumnDef="rcrdActs">
        <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
        <mat-cell *matCellDef="let rcrd">
          &nbsp; <a [routerLink]="['../edit/rcrd/', rcrd._id]">Edit</a> &nbsp;
          &nbsp; <a (click)="deleteRcrd(rcrd._id || '')">Delete</a>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdRsrv">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Reservation ID </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.rsrvtion}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdItem">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Item </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.itemName}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdLock">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Locker </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.itemLock}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdUser">
        <mat-header-cell *matHeaderCellDef mat-sort-header> User </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.userName}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdStrt">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Start </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.strtTime}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdStop">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Stop </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.stopTime}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdEvnt">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Event </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.pickedUp ? 'Pickup' : 'Return'}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdCond">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Condition </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.itemCond}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rcrdComm">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Comments </mat-header-cell>
        <mat-cell *matCellDef="let rcrd"> <p> {{rcrd.comments}} </p> </mat-cell>
      </ng-container>

      <!-- #endregion -->

      <!-- #region Reservation Data -->
      <ng-container matColumnDef="rsrvActs">
        <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
        <mat-cell *matCellDef="let rsrv">
          &nbsp; <a [routerLink]="['../edit/rsrv/', rsrv._id]">Edit</a> &nbsp;
          &nbsp; <a (click)="deleteRsrv(rsrv._id || '')">Delete</a>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="pickedUp">
        <mat-header-cell *matHeaderCellDef mat-sort-header> | | </mat-header-cell>
        <mat-cell *matCellDef="let rsrv"> <p> {{rsrv.pickedUp == true ? 'Y' : 'N'}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rsrvItem">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Item </mat-header-cell>
        <mat-cell *matCellDef="let rsrv"> <p> {{rsrv.itemName}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rsrvLock">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Lock </mat-header-cell>
        <mat-cell *matCellDef="let rsrv"> <p> {{rsrv.itemLock}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rsrvUser">
        <mat-header-cell *matHeaderCellDef mat-sort-header> User </mat-header-cell>
        <mat-cell *matCellDef="let rsrv"> <p> {{rsrv.userName}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rsrvStrt">
        <mat-header-cell *matHeaderCellDef mat-sort-header> Start </mat-header-cell>
        <mat-cell *matCellDef="let rsrv"> <p> {{rsrv.strtTime}} </p> </mat-cell>
      </ng-container>

      <ng-container matColumnDef="rsrvStop">
        <mat-header-cell *matHeaderCellDef mat-sort-header> End </mat-header-cell>
        <mat-cell *matCellDef="let rsrv"> <p> {{rsrv.stopTime}} </p> </mat-cell>
      </ng-container>
      <!-- #endregion -->

      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    </mat-table>

    <button class="admin-add" [routerLink]="[addButton]"> Add New </button>
    <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 50, 100]" [showFirstLastButtons]="true"></mat-paginator>
  </div>

  <button class="bubble-button" type="button" (click)="sendMail()"> Send Notifications </button>
  ` 
})
export class ManagerHomeComponent implements OnInit, OnDestroy {
  private emailSub: Subscription = new Subscription();
  private elemSub : Subscription = new Subscription();
  private accts$: Observable<Account[]> = new Observable();
  private items$: Observable<Item[]> = new Observable();
  private locks$: Observable<Locker[]> = new Observable();
  private rcrds$: Observable<Record[]> = new Observable();
  private rsrvs$: Observable<Reservation[]> = new Observable();

  public custName: string | undefined = "";
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns : string[] = [];
  public dataSrcTab: string = "";
  public addButton : string = "";

  constructor(
    private databaseService: DatabaseService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  ngOnInit(): void {
    this.custName = this.getUserNameFromInfo();
    this.changeTableDataSrc('acct');
  }
  ngOnDestroy(): void {
    this.emailSub.unsubscribe();
    this.elemSub.unsubscribe();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getUserNameFromInfo(): string {
    let cacheInfo = localStorage.getItem("userInfo")?.toString();
    if (cacheInfo) {
      let cacheStr = cacheInfo.split(" ");
      let userName = cacheStr[1] + " " + cacheStr[2];
      return userName;
    } else return '';
  }

  // delete an element
  deleteAcct(id: string): void { this.databaseService.deleteAccount(id).subscribe({ next: () => this.accts$ = this.databaseService.getAccounts() }); }
  deleteItem(id: string): void { this.databaseService.deleteItem(id).subscribe({ next: () => this.items$ = this.databaseService.getItems() }); }
  deleteLock(id: string): void { this.databaseService.deleteLocker(id).subscribe({ next: () => this.locks$ = this.databaseService.getLockers() }); }
  deleteRcrd(id: string): void { this.databaseService.deleteRecord(id).subscribe({ next: () => this.rcrds$ = this.databaseService.getRecords() }); }
  deleteRsrv(id: string): void { this.databaseService.deleteReservation(id).subscribe({ next: () => this.rsrvs$ = this.databaseService.getReservations() }); }

  changeTableDataSrc(collection : string): void {
    switch ( collection ) {
      case 'acct':
        this.elemSub = this.databaseService.getAccounts().subscribe( (data) => { this.dataSource.data = data; });
        this.displayedColumns = ['lastName', 'userName', 'userRFID', 'userType', 'userActs'];
        this.addButton = "../new/acct";
        this.dataSrcTab = 'acct';
        break;
      case 'item':
        this.elemSub = this.databaseService.getItems().subscribe( (data) => { this.dataSource.data = data; });
        this.displayedColumns = ['itemFree', 'itemIcon', 'itemName', 'itemLock', 'itemDesc', 'itemActs'];
        this.addButton = "../new/item";
        this.dataSrcTab = 'item';
        break;
      case 'lock':
        this.elemSub = this.databaseService.getLockers().subscribe( (data) => { this.dataSource.data = data; });
        this.displayedColumns = ['lockName', 'lockOpen', 'lockShut', 'lockActs'];
        this.addButton = "../new/lock";
        this.dataSrcTab = 'lock';
        break;
      case 'rcrd':
        this.elemSub = this.databaseService.getRecords().subscribe( (data) => { this.dataSource.data = data; });
        this.displayedColumns = ['rcrdRsrv', 'rcrdItem', 'rcrdLock', 'rcrdUser', 'rcrdStrt', 'rcrdStop', 'rcrdEvnt', 'rcrdCond', 'rcrdComm', 'rcrdActs'];
        this.addButton = "../new/rcrd";
        this.dataSrcTab = 'rcrd';
        break;
      case 'rsrv':
        this.elemSub = this.databaseService.getReservations().subscribe( (data) => { this.dataSource.data = data; });
        this.displayedColumns = ['pickedUp', 'rsrvItem', 'rsrvLock', 'rsrvUser', 'rsrvStrt', 'rsrvStop', 'rsrvActs'];
        this.addButton = "../new/rsrv";
        this.dataSrcTab = 'rsrv';
        break;
      default: throw Error('invalid collection');
    }
    this.changeDetectorRef.detectChanges();
  }

  sendMail() {
    let req: any = { 
      userName: 'ase127@msstate.edu',
      message: 'Your reservation for Skil Circular Saw will expire on 11/21/2022, 1:40:00 PM . Click here to extend: http://10.13.86.178:4200/'
    };
    this.emailSub = this.databaseService.sendMail(req).subscribe();
    window.location.reload();
  }
}