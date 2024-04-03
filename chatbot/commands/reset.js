import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prettyLog } from '../utils/prettyLog.js';
import { setAcceptPlayCommand } from '../utils/playState.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // 현재 디렉토리 경로

export function resetCommand(){
    const filePath = path.join(__dirname, '..', 'marble.csv');
    try {
        // marble.csv 파일 삭제
        fs.unlinkSync(filePath);
        prettyLog('marble.csv 파일이 성공적으로 삭제되었습니다.','info');
        setAcceptPlayCommand(true)
        prettyLog('다시 !play를 통해 참여 가능합니다.','info');

    } 
    catch (err) {
        if (err.code === 'ENOENT') {
            setAcceptPlayCommand(true);
            prettyLog('marble.csv 파일이 이미 삭제되었거나 존재하지 않습니다. 다시 !play를 통해 참여 가능합니다.','info');
        } else {
            prettyLog(`reset 명령어를 실행하는 중 오류 발생: ${err.message}.`, 'error');
        }
    }
}