import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // URL을 파일 경로로 변환하는 데 사용
import { prettyLog } from './prettyLog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // __dirname 유사한 기능 구현

// CSV 파일에서 기존 사용자 이름들을 읽어옵니다.
export function readUsernamesFromCSV() {
    const filePath = path.join(__dirname, '..', 'marble.csv');

    // 파일이 존재하지 않으면 빈 파일을 생성합니다.
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        prettyLog('marble.csv 파일이 존재하지 않아 새로 생성되었습니다.', 'info');
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data.split('\n').filter(Boolean); // 빈 행 제거
    } catch (err) {
        prettyLog(`CSV 파일을 읽는 중 오류 발생: ${err}`, 'error');
        return [];
    }
}
