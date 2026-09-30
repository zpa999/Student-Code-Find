import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBJXwoYvvATqPZpOKmjSrlUNYKSkSId_HA",
    authDomain: "studentcodefind.firebaseapp.com",
    projectId: "studentcodefind",
    storageBucket: "studentcodefind.firebasestorage.app",
    messagingSenderId: "313139330486",
    appId: "1:313139330486:web:fc89c2282b5dd9ab21d517"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 학번 2605001 문서 직접 조회
console.log('=== 문서 직접 조회 (학번 2605001) ===');
const docRef = doc(db, 'students', '2605001');
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
    const d = docSnap.data();
    console.log('name 필드:', JSON.stringify(d.name));
    console.log('name 글자수:', d.name ? d.name.length : 'undefined');
    console.log('전체 데이터:', JSON.stringify(d, null, 2));
} else {
    console.log('❌ 2605001 문서 없음!');
}

// name 필드로 검색
console.log('\n=== name 필드 검색 ===');
const q = query(collection(db, 'students'), where('name', '==', '강나연'));
const snap = await getDocs(q);
console.log('결과 수:', snap.size);
snap.forEach(d => console.log('결과:', JSON.stringify(d.data())));

process.exit(0);
