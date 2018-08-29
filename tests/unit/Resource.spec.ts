jest.mock('@/database');

import firebase from '@/database';
import * as mockFirebase from '@/database';
import { Resource, Precision } from '@/models/Resource';
import moment from 'moment';

let i = 0;
const Source = () => `Test${i++}`;

describe('database.ts', () => {
  it('should be mock database', () => {
    expect(firebase).toBeTruthy();
    expect((mockFirebase as any).mock).toBe(true);
  })
})

describe('Resource.ts', () => {
  it('should function normally with firebase fetch', async () => {
    const db = firebase.database();
    const resource = new Resource(Source(), 'CPU');
    const data = await resource.firebaseFetchData("233", "2333", Precision.minute).toPromise();
    expect(data).toEqual([]);
  })
  
  it('should function normally with firebase stream', done => {
    const db = firebase.database();
    const resource = new Resource(Source(), 'CPU');
    resource.firebaseStreamData("233", 2333, Precision.minute).subscribe(data => {
      expect(data).toEqual([]);
      done();
    })
  })

  it('should return data with firebase fetch', async () => {
    const db = firebase.database();
    const timestamp = moment('2018/08/01 09:00:00').unix();
    const end_timestamp = moment('2018/08/02 09:00:00').unix();
    const db_source = Source();
    await db.ref(`/${db_source}/CPU/minute/${timestamp}`).set({
      timestamp: timestamp,
      data: 233333
    });

    const resource = new Resource(db_source, 'CPU');
    const data = await resource.firebaseFetchData(`${timestamp}`, `${end_timestamp}`, Precision.minute).toPromise();
    expect(data).toEqual([{"id": "1533085200", "report": {"data": 233333, "timestamp": 1533085200}}]);
  })

  it('should return data with firebase stream', done => {
    const db = firebase.database();
    const timestamp = moment('2018/08/01 09:00:00').unix();
    const timestamp2 = moment('2018/08/02 09:00:00').unix();
    const db_source = Source();
    const data1 = () => db.ref(`/${db_source}/CPU/minute/${timestamp}`).set({
      timestamp: timestamp,
      data: 233333
    });
    const data2 = () => db.ref(`/${db_source}/CPU/minute/${timestamp2}`).set({
      timestamp: timestamp2,
      data: 233
    });

    const resource = new Resource(db_source, 'CPU');
    data1().then(res => {
      let dat_recved = false;
      resource.firebaseStreamData(`${timestamp}`, 2333, Precision.minute).subscribe(data => {
        if (!dat_recved) {
          expect(data).toEqual([{"id": "1533085200", "report": {"data": 233333, "timestamp": 1533085200}}]);
          dat_recved = true;
          data2().catch(console.error);
        } else {
          expect(data).toEqual([{"id": "1533085200", "report": {"data": 233333, "timestamp": 1533085200}}, {"id": "1533171600", "report": {"data": 233, "timestamp": 1533171600}}]);
          done();
        }
      });
    })
  })
})
