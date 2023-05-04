declare module '@angular/fire/compat/firestore/interfaces' {
  export interface DocumentSnapshotExists<T>
    extends firebase.firestore.DocumentSnapshot {
    data(options?: firebase.firestore.SnapshotOptions): T;
  }
}
