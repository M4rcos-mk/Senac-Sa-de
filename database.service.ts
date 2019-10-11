
import { Observable } from 'rxjs';
/*realizar as importações*/
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Action } from 'rxjs/internal/scheduler/Action';

 
export interface Database{
  
  task: string;
  id?: string;
  createdAd: number;
  email: string;
  peso: number;
  pressao: number;
  glicose: number;
  altura: number;
  nascimento: number;
  msg: string;
  imc: number;
 };

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
private databasesCollection: AngularFirestoreCollection<Database>
private databases:Observable<Database[]>;

  constructor(db:AngularFirestore) {
    this.databasesCollection = db.collection<Database>("databases");

    this.databases = this.databasesCollection.snapshotChanges().pipe(
      map(actions=>{
        return actions.map(a =>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
   }
   
   getDatabase(){
    return this.databases;
  } 
  getDatabases(id) {
    return this.databasesCollection.doc<Database>(id).valueChanges();
  }
  updateDatabase(database: Database, id: string){
    return this.databasesCollection.doc(id).update(database);
  }
  addDatabase(database:Database){
    return this.databasesCollection.add(database);
  }

  removeDatabase(id){
   return this.databasesCollection.doc(id).delete();
  }
 }

