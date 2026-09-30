// Firebase 프로젝트 설정값 - Firebase 콘솔에서 복사한 값으로 교체해주세요!
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBJXwoYvvATqPZpOKmjSrlUNYKSkSId_HA",
  authDomain: "studentcodefind.firebaseapp.com",
  projectId: "studentcodefind",
  storageBucket: "studentcodefind.firebasestorage.app",
  messagingSenderId: "313139330486",
  appId: "1:313139330486:web:fc89c2282b5dd9ab21d517"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
