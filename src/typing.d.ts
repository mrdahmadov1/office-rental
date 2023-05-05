import firebase from 'firebase/compat/app';

declare module '@angular/fire/compat/firestore/interfaces' {
  export interface DocumentSnapshotExists<T>
    extends firebase.firestore.DocumentSnapshot<T> {
    data(options?: SnapshotOptions): T;
  }

  export interface QueryDocumentSnapshot<T>
    extends firebase.firestore.QueryDocumentSnapshot<T> {
    data(options?: SnapshotOptions): T;
  }

  export interface QuerySnapshot<T>
    extends firebase.firestore.QuerySnapshot<T> {
    readonly docs: QueryDocumentSnapshot<T>[];
  }
  export interface DocumentChange<T>
    extends firebase.firestore.DocumentChange<T> {
    readonly doc: QueryDocumentSnapshot<T>;
  }
}
