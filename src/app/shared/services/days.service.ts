import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserDay } from 'src/app/shared/models/UserDay';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  collectionName = 'UserDays';

  constructor(private firestore: AngularFirestore) { }

  create(email: string, userDays: Array<UserDay>) {
    return this.firestore.collection<Array<UserDay>>(this.collectionName).doc(email).set(userDays);
  }

  getAll() {
    return this.firestore.collection<Array<UserDay>>(this.collectionName).valueChanges();
  }

  getByEmail(email: string) {
    return this.firestore.collection<Array<UserDay>>(this.collectionName).doc(email).valueChanges();
  }

  update(email: string, userDays: Array<UserDay>) {
    return this.firestore.collection<Array<UserDay>>(this.collectionName).doc(email).set(userDays);
  }

  deleteByEmail(email: string) {
    return this.firestore.collection<Array<UserDay>>(this.collectionName).doc(email).delete();
  }
}
