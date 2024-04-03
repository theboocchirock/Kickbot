import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // 현재 디렉토리 경로

// CSV 파일에 사용자 이름을 추가하는 함수
export function appendToCSV(username) {
    const filePath = path.join(__dirname, '..', 'marble.csv');
    fs.appendFileSync(filePath, username + '\n');
}
