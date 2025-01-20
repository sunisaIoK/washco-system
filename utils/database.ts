import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { CollectionGroup, CollectionReference, DocumentData, DocumentSnapshot, Firestore, Query, Timestamp, getFirestore } from "firebase-admin/firestore";

let app: App;

const projectId = process.env.FIREBASE_PROJECT_ID?.toString();
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.toString();
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.toString()?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase environment variables');
}

if (!getApps().length) {
    app = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
} else {
    app = getApps()[0];
}

let firestoreInstance: Firestore | null = null;

function getFirestoreInstance(): Firestore {
    if (!firestoreInstance) {
        firestoreInstance = getFirestore(app, process.env.FIREBASE_DATABASE_ID || '(default)');
    }
    return firestoreInstance;
}

type Converter<T> = {
    toFirestore: (data: T) => DocumentData;
    fromFirestore: (snap: DocumentSnapshot) => T;
}

class firestore {
    static getCollection(arg0: string) {
        throw new Error('Method not implemented.');
    }
    private db: Firestore;

    constructor() {
        this.db = getFirestoreInstance();
    }

     getCollection(collection: string) {
        return this.db.collection(collection);
    }
}
export default firestore