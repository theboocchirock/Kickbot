import { Events, Kient } from 'kient'
import fs from 'fs';

// settings.json 파일에서 채널 ID를 읽어옵니다.
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const channelId = settings.channelId;

//유튜브 정규식
const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// CSV 파일에서 기존 사용자 이름들을 읽어옵니다.
function readUsernamesFromCSV() {
    const filePath = './chatreader/marble.csv';

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

// CSV 파일에 사용자 이름을 추가하는 함수
function appendToCSV(username) {
    fs.appendFileSync('./chatreader/marble.csv', username + '\n');
}

function prettyLog(message, type = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    const styles = {
        log: '\x1b[37m',
        info: '\x1b[34m',
        warn: '\x1b[33m',
        error: '\x1b[31m'
    };
    const reset = '\x1b[0m';
    const style = styles[type] || styles.log;

    console.log(`${style}[${timestamp}] ${message}${reset}`);
}

const client = await Kient.create()

const channel = await client.api.channel.getChannel(channelId)
await channel.connectToChatroom()

let acceptPlayCommand = true;

//메시지 읽기 시작!
client.on(Events.Chatroom.Message, async (messageInstance) => {
    const message = messageInstance.data;

    /* 영상도네*/
    
    // 메시지 내용이 !sr로 시작하고 유튜브 링크가 포함되어 있는지 확인합니다.
    if (message.content.startsWith('!sr ') && ytRegex.test(message.content)) {
        // 유튜브 영상의 코드를 추출합니다.
        const youtubeLink = message.content.match(ytRegex)[1];

        // 보낸 사용자의 정보를 추출합니다.
        const senderName = message.sender.username; // 사용자의 이름

        // 유튜브 영상의 코드와 보낸 사용자의 이름을 JSON 형식으로 저장합니다.
        const videoInfo = {
            videoId: youtubeLink,
            sender: senderName
        };

        // JSON 형식으로 저장된 유튜브 영상 정보를 콘솔에 출력합니다.
        prettyLog(`유튜브 영상 정보: ${JSON.stringify(videoInfo, null, 2)}`, 'info');
    }

    /* 구슬치기 */

    // !play 명령어 처리
    if (message.content.startsWith('!play ') && acceptPlayCommand) {
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
    if (message.content.startsWith('!stop ') && message.sender.username ==  channelId ) {
        acceptPlayCommand = false; // !play 명령어 처리 중지
        prettyLog('!play 명령어 처리가 중지되었습니다.', 'info');
    }
    // !reset 명령어 처리
    if (message.content.startsWith('!reset ') && message.sender.username ==  channelId){
        try {
            // marble.csv 파일 삭제
            fs.unlinkSync('./chatreader/marble.csv');
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
