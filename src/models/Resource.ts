import firebase from '@/database';
import { Observable, from as toObservable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

const db = firebase.database();

export enum Precision {
  second = 'second',
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  month = 'month'
}

const MAX_LIMIT = 2000;

export interface IReport {
  timestamp: number,
  data: number
}

export interface IData {
  id: string,
  report: IReport
}

export class Resource {
  private data: firebase.database.Reference
  constructor(
    private source: string,
    private subscription: string
  ) {
    this.data = db.ref(`/${source}`).child(subscription);
  }

  private firebaseSnapshotToDict(querySnapshot: firebase.database.DataSnapshot | null) {
    const result: IData[] = [];
    if (!querySnapshot) return result;
    querySnapshot!.forEach(doc => {
      result.push({
        id: doc.key as string,
        report: doc.val() as IReport
      });
    });
    return result;
  }

  private firebaseFetchData(from: string, to: string, precision: Precision) {
    return Observable.create((observer: Observer<firebase.database.DataSnapshot | null>) => {
      const cmd = (querySnapshot: firebase.database.DataSnapshot | null) => {
        observer.next(querySnapshot);
        observer.complete();
      }
      const loc = this.data.child(precision)
        .orderByKey()
        .startAt(from)
        .endAt(to)
        .limitToLast(MAX_LIMIT);
      loc.once('value', cmd);
      return () => loc.off('value', cmd);
    }).pipe(
      map((querySnapshot: firebase.database.DataSnapshot | null) => this.firebaseSnapshotToDict(querySnapshot))
    );
  }

  private firebaseStreamData(from: string, limit: number, precision: Precision) {
    return Observable.create((observer: Observer<firebase.database.DataSnapshot>) => {
      const cmd = function (querySnapshot: firebase.database.DataSnapshot | null) {
        observer.next(querySnapshot!)
      }
      const loc = this.data.child(precision)
        .orderByKey()
        .startAt(from)
        .limitToLast(limit);
      loc.on('value', cmd);
      return () => loc.off('value', cmd);
    }).pipe(
      map((querySnapshot: firebase.database.DataSnapshot) => this.firebaseSnapshotToDict(querySnapshot))
    )
  }

  public stream(from: string, limit: number, precision: Precision) {
    return this.firebaseStreamData(from, limit, precision);
  }

  public fetch(from: string, to: string, precision: Precision) {
    return this.firebaseFetchData(from, to, precision);
  }
}
