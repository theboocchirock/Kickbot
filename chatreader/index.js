import { Events, Kient } from 'kient'
import fs from 'fs';

// settings.json 파일에서 채널 ID를 읽어옵니다.
const settings = JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
const channelId = settings.channelId;

//유튜브 정규식
const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// CSV 파일에서 기존 사용자 이름들을 읽어옵니다.
function readUsernamesFromCSV() {
    try {
        const data = fs.readFileSync('./chatreader/marble.csv', 'utf-8');
        return data.split('\n').filter(Boolean); // 빈 행 제거
    } catch (err) {
        console.error('CSV 파일을 읽는 중 오류 발생:', err);
        return [];
    }
}
// CSV 파일에 사용자 이름을 추가하는 함수
function appendToCSV(username) {
    fs.appendFileSync('./chatreader/marble.csv', username + '\n');
}

const client = await Kient.create()

const channel = await client.api.channel.getChannel(channelId)
await channel.connectToChatroom()


//메시지 읽기 시작!
client.on(Events.Chatroom.Message, async (messageInstance) => {
    const message = messageInstance.data;

    // 메시지 내용이 !sr로 시작하고 유튜브 링크가 포함되어 있는지 확인합니다.
    if (message.content.startsWith('!sr') && ytRegex.test(message.content)) {
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
        console.log('유튜브 영상 정보:', JSON.stringify(videoInfo));
    }
    // !play로 시작하는 메시지 처리
    if (message.content.startsWith('!play')) {
        const senderName = message.sender.username;
        console.log('!play를 시작한 사용자:', senderName);

        // CSV 파일에서 기존 사용자 이름들을 읽어옵니다.
        const existingUsernames = readUsernamesFromCSV();

        // 새로운 사용자 이름이 중복되지 않으면 CSV 파일에 추가합니다.
        if (!existingUsernames.includes(senderName)) {
            appendToCSV(senderName);
        }
        else {
            console.log("중복참여는 안되ㅣㄴ다")
        }
    }

    if (message.content.startsWith('!reset') && message.sender.username ==  channelId){
        console.log("킥씨발려나")
    }
});
