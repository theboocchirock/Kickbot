import { prettyLog } from '../utils/prettyLog.js';

const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function srCommand(message) {
    const youtubeLink = message.content.match(ytRegex)[1];
    const senderName = message.sender.username;
    const videoInfo = {
        videoId: youtubeLink,
        sender: senderName
    };
    prettyLog(`유튜브 영상 정보: ${JSON.stringify(videoInfo, null, 2)}`, 'info');
}