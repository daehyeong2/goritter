import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4_rfUI8BhL32BqPkyiZMNv99Yfplv_KM",
  authDomain: "goritter-2fc9c.firebaseapp.com",
  projectId: "goritter-2fc9c",
  storageBucket: "goritter-2fc9c.appspot.com",
  messagingSenderId: "567858212897",
  appId: "1:567858212897:web:c13576ff3095e26a8b7360",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
