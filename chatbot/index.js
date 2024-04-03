import { Events, Kient } from 'kient'
import fs from 'fs';

import { prettyLog } from './utils/prettyLog.js';
import { readUsernamesFromCSV } from './utils/readUsernamesFromCSV.js'
import { appendToCSV } from './utils/appendToCSV.js';
import { srCommand } from './commands/songrequest.js'

// settings.json 파일에서 채널 ID를 읽어옵니다.
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const channelId = settings.channelId;

const client = await Kient.create()

const channel = await client.api.channel.getChannel(channelId)
await channel.connectToChatroom()

let acceptPlayCommand = true;

//메시지 읽기 시작!
client.on(Events.Chatroom.Message, async (messageInstance) => {
    const message = messageInstance.data;

    /* 영상도네*/
    
    // 메시지 내용이 !sr로 시작하고 유튜브 링크가 포함되어 있는지 확인합니다.
    if (message.content.startsWith('!sr')) {
        srCommand(message);
    }

    /* 구슬치기 */

    // !play 명령어 처리
    if (message.content.startsWith('!play') && acceptPlayCommand) {
        const senderName = message.sender.username;
        prettyLog(`!play사용: ${senderName}`, 'info');

        const existingUsernames = readUsernamesFromCSV();
        if (!existingUsernames.includes(senderName)) {
            appendToCSV(senderName);
        } else {
            prettyLog("중복 참여는 허용되지 않습니다.", 'warn');
        }
    }

    /* 관리자용 명령어 */

    // !stop 명령어 처리
    if (message.content.startsWith('!stop') && message.sender.username ==  channelId ) {
        acceptPlayCommand = false; // !play 명령어 처리 중지
        prettyLog('!play 명령어 처리가 중지되었습니다.', 'info');
    }
    // !reset 명령어 처리
    if (message.content.startsWith('!reset') && message.sender.username ==  channelId){
        try {
            // marble.csv 파일 삭제
            fs.unlinkSync('./chatbot/marble.csv');
            prettyLog('marble.csv 파일이 성공적으로 삭제되었습니다.','info');
            acceptPlayCommand = true;
            prettyLog('다시 !play를 통해 참여 가능합니다.','info');

        } 
        catch (err) {
            if (err.code === 'ENOENT') {
                acceptPlayCommand = true; 
                prettyLog('marble.csv 파일이 이미 삭제되었거나 존재하지 않습니다. 다시 !play를 통해 참여 가능합니다.','info');
            } else {
                prettyLog(`reset 명령어를 실행하는 중 오류 발생: ${err.message}.`, 'error');
            }
        }
    }
}
);
