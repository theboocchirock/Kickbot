import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { router, handleSocketEvents } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 29523;

//아무것도아니야
//ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄹ

app.set('views', path.join(__dirname, 'public'));

app.use(express.json());
app.use('/', router);


io.on('connection', (socket) => {
  const clientIpAddress = socket.request.connection.remoteAddress;
  const clientPort = socket.request.connection.remotePort;
  const userAgent = socket.request.headers['user-agent'];
  console.log(`클라이언트가 연결되었습니다. IP: ${clientIpAddress}, Port: ${clientPort}, User-Agent: ${userAgent}`);
  handleSocketEvents(socket, io);
});

httpServer.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});

export { app, io };