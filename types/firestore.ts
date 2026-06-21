import { Timestamp } from "firebase/firestore";

export type FirestoreDoc = {
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};