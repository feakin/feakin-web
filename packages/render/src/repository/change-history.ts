import { nanoid } from "nanoid";

import PouchDB from "pouchdb";

export class ChangeHistory {
  db = new PouchDB('dbname');

  constructor() {

  }

  id() {
    return nanoid();
  }

  last() {

  }

  countHistory() {

  }

  save(code: string) {
    this.db.put({
      _id: this.id(),
      title: 'local',
      content: code
    }).then((_response: any) => {
      // handle response
    }).catch((err: any) => {
      console.log(err);
    });
  }
}
