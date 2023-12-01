import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { Account } from '../_interfaces/account';
import { Item } from '../_interfaces/item';
import { Locker } from '../_interfaces/locker';
import { Reservation } from '../_interfaces/reservation';
import { Record } from '../_interfaces/record';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private url = 'http://localhost:5200';  // for remote dev
  // private url = 'http://10.13.86.178:5200'; // for on-site dev
  private accounts$: Subject<Account[]> = new Subject();
  private items$: Subject<Item[]> = new Subject();
  private lockers$: Subject<Locker[]> = new Subject();
  private reservations$: Subject<Reservation[]> = new Subject();
  private records$: Subject<Record[]> = new Subject();
  
  constructor(private httpClient: HttpClient) { }

  // unlock locker
  addQueue(body: string) {
    return this.httpClient.post(`${this.url}/addQueue`, body, { responseType: 'text' });
  }

  // get RFID from scanner
  getRFID(): Observable<string> {
    return this.httpClient.get<string>(`${this.url}/getRFID`);
  }

  // email notifications
  sendMail(body: string) {
    return this.httpClient.post(`${this.url}/email`, body, { responseType: 'text' })
  }

  // ----- Accounts -----
  // update website-stored accounts collection from database
  private refreshAccounts() {
    this.httpClient.get<Account[]>(`${this.url}/manage/accounts`)
      .subscribe(accounts => {
        this.accounts$.next(accounts);
      });
  }
  // get accounts collection
  getAccounts(): Subject<Account[]> {
    this.refreshAccounts();
    return this.accounts$;
  }
  // find an existing account
  getAccount(id: string): Observable<Account> {
    return this.httpClient.get<Account>(`${this.url}/manage/accounts/${id}`);
  }
  // create a new account
  createAccount(account: Account): Observable<string> {
    return this.httpClient.post(`${this.url}/manage/accounts`, account, { responseType: 'text' });
  }
  // update an existing account
  updateAccount(id: string, account: Account): Observable<string> {
    return this.httpClient.put(`${this.url}/manage/accounts/${id}`, account, { responseType: 'text' });
  }
  // delete an existing account
  deleteAccount(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/manage/accounts/${id}`, { responseType: 'text' });
  }

  // ----- Items -----
  // update website-stored items collection from database
  private refreshItems() {
    this.httpClient.get<Item[]>(`${this.url}/manage/items`)
      .subscribe(items => {
        this.items$.next(items);
      });
  }
  // get items collection
  getItems(): Subject<Item[]> {
    this.refreshItems();
    return this.items$;
  }
  // find an existing item
  getItem(id: string): Observable<Item> {
    return this.httpClient.get<Item>(`${this.url}/manage/items/${id}`);
  }
  // create a new item
  createItem(item: Item): Observable<string> {
    return this.httpClient.post(`${this.url}/manage/items`, item, { responseType: 'text' });
  }
  // update an existing item
  updateItem(id: string, item: Item): Observable<string> {
    return this.httpClient.put(`${this.url}/manage/items/${id}`, item, { responseType: 'text' });
  }
  // delete an existing item
  deleteItem(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/manage/items/${id}`, { responseType: 'text' });
  }

  // ----- Lockers -----
  // update website-stored lockers collection from database
  private refreshLockers() {
    this.httpClient.get<Locker[]>(`${this.url}/manage/lockers`)
      .subscribe(lockers => {
        this.lockers$.next(lockers);
      });
  }
  // get lockers collection
  getLockers(): Subject<Locker[]> {
    this.refreshLockers();
    return this.lockers$;
  }
  // find an existing locker
  getLocker(id: string): Observable<Locker> {
    return this.httpClient.get<Locker>(`${this.url}/manage/lockers/${id}`);
  }
  // create a new locker
  createLocker(locker: Locker): Observable<string> {
    return this.httpClient.post(`${this.url}/manage/lockers`, locker, { responseType: 'text' });
  }
  // update an existing locker
  updateLocker(id: string, locker: Locker): Observable<string> {
    return this.httpClient.put(`${this.url}/manage/lockers/${id}`, locker, { responseType: 'text' });
  }
  // delete an existing locker
  deleteLocker(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/manage/lockers/${id}`, { responseType: 'text' });
  }

  // ----- Reservations -----
  // update website-stored reservations collection from database
  private refreshReservations() {
    this.httpClient.get<Reservation[]>(`${this.url}/manage/reservations`)
      .subscribe(reservations => {
        this.reservations$.next(reservations);
      });
  }
  // get reservations collection
  getReservations(): Subject<Reservation[]> {
    this.refreshReservations();
    return this.reservations$;
  }
  // find an existing reservation
  getReservation(id: string): Observable<Reservation> {
    return this.httpClient.get<Reservation>(`${this.url}/manage/reservations/${id}`);
  }
  // create a new reservation
  createReservation(reservation: Reservation): Observable<string> {
    return this.httpClient.post(`${this.url}/manage/reservations`, reservation, { responseType: 'text' });
  }
  // update an existing reservation
  updateReservation(id: string, reservation: Reservation): Observable<string> {
    return this.httpClient.put(`${this.url}/manage/reservations/${id}`, reservation, { responseType: 'text' });
  }
  // delete an existing reservation
  deleteReservation(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/manage/reservations/${id}`, { responseType: 'text' });
  }

  // ----- Records -----
  // update website-stored records collection from database
  private refreshRecords() {
    this.httpClient.get<Record[]>(`${this.url}/manage/records`)
      .subscribe(records => {
        this.records$.next(records);
      });
  }
  // get records collection
  getRecords(): Subject<Record[]> {
    this.refreshRecords();
    return this.records$;
  }
  // find an existing record
  getRecord(id: string): Observable<Record> {
    return this.httpClient.get<Record>(`${this.url}/manage/records/${id}`);
  }
  // create a new record
  createRecord(record: Record): Observable<string> {
    return this.httpClient.post(`${this.url}/manage/records`, record, { responseType: 'text' });
  }
  // update an existing record
  updateRecord(id: string, record: Record): Observable<string> {
    return this.httpClient.put(`${this.url}/manage/records/${id}`, record, { responseType: 'text' });
  }
  // delete an existing record
  deleteRecord(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/manage/records/${id}`, { responseType: 'text' });
  }
}