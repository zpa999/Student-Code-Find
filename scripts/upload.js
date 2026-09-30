/**
 * 엑셀 파일을 Firebase Firestore에 업로드하는 스크립트
 * 실행: node scripts/upload.js
 */

import { readFileSync } from 'fs';
import { read, utils } from 'xlsx';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase 설정
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

async function uploadStudents() {
    const excelPath = join(__dirname, '..', '신입생 학번 및 정보 파일.xlsx');

    console.log('📂 엑셀 파일 읽기 중...');
    const buffer = readFileSync(excelPath);
    const wb = read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = utils.sheet_to_json(ws, { header: 1 });

    // 첫 번째 행(헤더) 제외
    const dataRows = rows.slice(1).filter(row => row[1] && row[2]);

    console.log(`📊 총 ${dataRows.length}명의 데이터를 업로드합니다...`);

    let successCount = 0;
    let failCount = 0;

    for (const row of dataRows) {
        const [className, studentId, name, , gender] = row;

        if (!studentId || !name) continue;

        const studentData = {
            className: className || '',
            studentId: String(studentId),
            name: String(name).trim(),
            gender: gender || '',
        };

        try {
            await setDoc(doc(collection(db, 'students'), String(studentId)), studentData);
            console.log(`  ✅ ${name} (${studentId}) 업로드 완료`);
            successCount++;
        } catch (err) {
            console.error(`  ❌ ${name} (${studentId}) 업로드 실패:`, err.message);
            failCount++;
        }
    }

    console.log('\n=============================');
    console.log(`✅ 성공: ${successCount}명`);
    if (failCount > 0) console.log(`❌ 실패: ${failCount}명`);
    console.log('🎉 업로드 완료!');
    process.exit(0);
}

uploadStudents().catch(err => {
    console.error('오류 발생:', err);
    process.exit(1);
});
