import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { MyObject } from './myObject';
import { UserDay } from 'src/app/shared/models/UserDay';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DaysService {

  collectionName = 'UserDays';

  constructor(private firestore: AngularFirestore) { }

  create(email: string, userDays: Array<UserDay>) {
    return this.firestore.collection<MyObject>(this.collectionName).doc(email).set(Object.assign({}, userDays));
  }

  getAll() {
    return this.firestore.collection<MyObject>(this.collectionName).valueChanges();
  }

  getByEmail(email: string) {
    return this.firestore.collection<MyObject>(this.collectionName).doc(email).valueChanges();
  }

  update(email: string, userDays: MyObject) {
    return this.firestore.collection<MyObject>(this.collectionName).doc(email).set(userDays);
  }

  deleteByEmail(email: string) {
    return this.firestore.collection<MyObject>(this.collectionName).doc(email).delete();
  }

  addDay(email: string, userDay: UserDay): Promise<boolean> {
    userDay = Object.assign({}, userDay);
    const dateEpoch = userDay.date.valueOf();
    return new Promise((resolve, reject) => {
      this.getByEmail(email).pipe(first()).subscribe(days => {
        if (!days) {
          console.log("creating days");
          this.create(email, [userDay]).then(() => {
            resolve(true);
          }).catch(err => {
            console.error(err);
            reject(false);
          });
        } else {
          let keys = Object.keys(days);
          const existingKey = keys.find(k => days[k].date.valueOf() === dateEpoch);
          if (existingKey) {
            console.log("deleting existing day");
            delete days[existingKey];
          }
          const nextKey = (keys.length > 0 ? Math.max(...keys.map(k => parseInt(k))) + 1 : 0).toString();
          days[nextKey] = userDay;
    
          console.log("updating days");
          this.update(email, days).then(() => {
            resolve(true);
          }).catch(err => {
            console.error(err);
            reject(false);
          });
        }
      });
    });
  }
  
  deleteByDate(email: string, date: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getByEmail(email).pipe(first()).subscribe(days => {
        if (!days) {
          console.log("no user found");
          resolve(false);
        } else {
          const filteredDays = Object.assign({}, Object.values(days).filter((day: UserDay) => day.date !== date));
          this.update(email, filteredDays).then(() => {
            console.log("day deleted");
            resolve(true);
          }).catch(err => {
            console.error(err);
            reject(false);
          });
        }
      });
    });
  }
}
