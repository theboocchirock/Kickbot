import { Events, Kient } from 'kient'
import fs from 'fs';

import { prettyLog } from './utils/prettyLog.js';
import { readUsernamesFromCSV } from './utils/readUsernamesFromCSV.js'
import { appendToCSV } from './utils/appendToCSV.js';
import { getAcceptPlayCommand, setAcceptPlayCommand } from './utils/playState.js';

import { srCommand } from './commands/songrequest.js'
import { playCommand } from './commands/play.js';
import { stopCommand } from './commands/stop.js';
import { resetCommand } from './commands/reset.js';

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
    if (message.content.startsWith('!play') && getAcceptPlayCommand()) {
        playCommand(message)
        console.log(getAcceptPlayCommand())
    }

    /* 관리자용 명령어 */

    // !stop 명령어 처리
    if (message.content.startsWith('!stop') && message.sender.username ==  channelId ) {
        stopCommand();
    }
    // !reset 명령어 처리
    if (message.content.startsWith('!reset') && message.sender.username ==  channelId){
        resetCommand();
    }
}
);
