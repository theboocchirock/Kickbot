import { prettyLog } from '../utils/prettyLog.js';
import { appendToCSV } from '../utils/appendToCSV.js';
import { readUsernamesFromCSV } from '../utils/readUsernamesFromCSV.js'

export function playCommand(message){
    const senderName = message.sender.username;
    prettyLog(`!play사용: ${senderName}`, 'info');

    const existingUsernames = readUsernamesFromCSV();
    if (!existingUsernames.includes(senderName)) {
        appendToCSV(senderName);
    } else {
        prettyLog("중복 참여는 허용되지 않습니다.", 'warn');
    }
}