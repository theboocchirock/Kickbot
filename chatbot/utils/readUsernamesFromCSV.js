import fs from 'fs';
import { prettyLog } from '../utils/prettyLog.js';

// CSV 파일에서 기존 사용자 이름들을 읽어옵니다.
export function readUsernamesFromCSV() {
    const filePath = '../marble.csv';

    // 파일이 존재하지 않으면 빈 파일을 생성합니다.
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        prettyLog('marble.csv 파일이 존재하지 않아 새로 생성되었습니다.','info');
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data.split('\n').filter(Boolean); // 빈 행 제거
    } catch (err) {
        prettyLog(`CSV 파일을 읽는 중 오류 발생: ${err}`, 'info');
        return [];
    }
}