import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fruit } from '../models/Fruit';

@Injectable({
  providedIn: 'root'
})
export class FruitService {

  private collectionName = 'fruits';
  private collection: AngularFirestoreCollection<Fruit>;

  constructor(private firestore: AngularFirestore) {
    this.collection = this.firestore.collection<Fruit>(this.collectionName);
  }

  create(fruit: Fruit): Promise<void> {
    const id = this.firestore.createId();
    return this.collection.doc(id).set(fruit);
  }

  getAll(): Observable<Fruit[]> {
    return this.firestore.collection<Fruit>('Fruit', ref => ref.orderBy('vitaminC')).valueChanges();
  }

  update(fruit: Fruit): Promise<void> {
    return this.collection.ref.where('name', '==', fruit.name).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update(fruit);
      });
    });
  }
  

  delete(id: string): Promise<void> {
    return this.collection.doc(id).delete();
  }
}
