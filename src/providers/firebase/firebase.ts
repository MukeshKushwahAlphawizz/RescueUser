import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class FirebaseProvider {
  items: Observable<any[]>;
  constructor(public http: HttpClient,public db : AngularFireDatabase) {
    console.log('Hello FirebaseProvider Provider');
  }

  getAll(){
    /*const itemRef = this.db.object('reacueanycar'); //add object
    itemRef.set({ name: 'new name!'});*/

    /*const itemRef = this.db.object('reacueanycar'); //udate object
    itemRef.update({ age: 12 });*/

    /*const itemRef = this.db.object('reacueanycar/age');
    itemRef.remove();*/

    this.items = this.db.list('/').valueChanges();

    this.items.subscribe(data=>{
      console.log('list data is >>>',data);
    });


    let itemRef = this.db.object('reacueanycar');
    itemRef.snapshotChanges().subscribe(action => {
      console.log(action);
      console.log(action.type);
      console.log(action.key)
      console.log(action.payload.val())
    });
    // console.log('getAll item >>>',this.items);
  }

}
