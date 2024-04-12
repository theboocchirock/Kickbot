import axios from 'axios';
import { prettyLog } from '../utils/prettyLog.js';

const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export async function srCommand(message) {
    const matches = message.content.match(ytRegex);
    if (!matches) {
        prettyLog('유튜브 링크가 메시지에 포함되어 있지 않습니다.', 'warn');
        return;
    }
    const youtubeLink = matches[1];
    const senderName = message.sender.username;

    try {
        const response = await axios.post('http://localhost:29523/api/addvideo', {
            video_id: youtubeLink,
            senderName: senderName
        });
        prettyLog(`비디오가 성공적으로 추가되었습니다: ${response.data}`, 'info');
    } catch (error) {
        prettyLog(`비디오 추가 중 오류 발생: ${error.message}`, 'error');
    }
}
