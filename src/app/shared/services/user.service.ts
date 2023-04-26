import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  collectionName = 'Users';

  constructor(private firestore: AngularFirestore) { }

  create(user: User) {
    return this.firestore.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  getAll() {
    return this.firestore.collection<User>(this.collectionName).valueChanges();
  }

  getById(id: string) {
    return this.firestore.collection<User>(this.collectionName).doc(id).valueChanges();
  }

  update(user: User) {
    return this.firestore.collection<User>(this.collectionName).doc(user.id).set(user);
  }

  delete(id: string) {
    return this.firestore.collection<User>(this.collectionName).doc(id).delete();
  }
}
