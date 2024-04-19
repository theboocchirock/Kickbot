import express from 'express';
import fs from 'fs';
import path from 'path';
import { app, io } from './index.js';
import bodyParser from 'body-parser';


const router = express.Router();

router.post('/api/addvideo', (req, res) => {
    const { video_id, senderName } = req.body;
  
    if (!video_id || !senderName) {
      return res.status(400).json({ error: 'video_id 또는 senderName이 없습니다.' });
    }
  
    let data = [];
  
    try {
      const fileData = fs.readFileSync('./server/youtubeLink.json', 'utf-8');
      if (fileData) {
        data = JSON.parse(fileData);
      }
    } catch (err) {
      console.error('파일을 읽는 중 오류 발생:', err);
      return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  
    const senderVideos = data.filter(video => video.senderName === senderName);
  
    if (senderVideos.length >= 3) {
      return res.status(400).json({ error: '같은 senderName으로 요청된 영상이 3개를 초과하였습니다.' });
    }
  
    data.push({ video_id, senderName });
  
    try {
      fs.writeFileSync('./server/youtubeLink.json', JSON.stringify(data, null, 2));
      console.log(JSON.stringify({ video_id, senderName }));
      res.status(200).json({ message: '유튜브 링크가 성공적으로 추가되었습니다.' });
      io.emit('videoAdded');
    } catch (err) {
      console.error('파일을 쓰는 중 오류 발생:', err);
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  });

  router.post('/api/delvideo', (req, res) => {
    const { video_id } = req.body;
    if (!video_id) {
      return res.status(400).json({ error: 'video_id가 없습니다.' });
    }
  
    fs.readFile('./server/youtubeLink.json', 'utf-8', (err, data) => {
      if (err) {
        console.error('파일을 읽는 중 오류 발생:', err);
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }
  
      let videos = JSON.parse(data);
      const initialLength = videos.length;
      videos = videos.filter(video => video.video_id !== video_id);
  
      if (videos.length === initialLength) {
        return res.status(404).json({ error: '해당 video_id를 가진 영상을 찾을 수 없습니다.' });
      }
  
      fs.writeFile('./server/youtubeLink.json', JSON.stringify(videos, null, 2), (err) => {
        if (err) {
          console.error('파일을 쓰는 중 오류 발생:', err);
          return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
  
        res.status(200).json({ message: '영상이 성공적으로 삭제되었습니다.' });
      });
    });
  });

  router.get('/', (req, res) => {
    fs.readFile('./server/youtubeLink.json', 'utf-8', (err, data) => {
      if (err) {
        console.error('파일을 읽는 중 오류 발생:', err);
        return res.status(500).send('서버 오류가 발생했습니다.');
      }
  
      const videos = JSON.parse(data);
  
      if (videos.length === 0) {
        res.send(`
          <html>
            <head>
              <title>유튜브 영상 임베드</title>
              <script src="/socket.io/socket.io.js"></script>
              <script>
                var socket = io();
                socket.on('videoAdded', function() {
                    window.location.reload(true);
                });
              </script>
            </head>
            <body>
              <h1>재생할 영상이 없습니다. 재생할 영상이 없습니다. 재생할 영상이 없습니다.</h1>
            </body>
          </html>
        `);
      } else {
        const firstVideo = videos[0];
        res.render('index.ejs', { videoId: firstVideo.video_id });
      }
    });
  });

  router.get('/control', (req, res) => {
    fs.readFile('./server/youtubeLink.json', 'utf-8', (err, data) => {
      if (err) {
        console.error('파일을 읽는 중 오류 발생:', err);
        return res.status(500).send('서버 오류가 발생했습니다.');
      }
  
      let videos = [];
      if (data) {
        videos = JSON.parse(data);
      }
  
      if (videos.length === 0) {
        return res.render('control.ejs');
      }
  
      const firstVideo = videos[0];
      res.render('control.ejs', { videoId: firstVideo.video_id });
    });
  });

export { router };
export function handleSocketEvents(socket, io) {
    socket.on('skipVideo', () => {
      // 영상 스킵 로직 구현
      // 필요한 경우 클라이언트에게 스킵 이벤트 전송
      console.log("예아!!")
      io.emit('videoSkipped');
    });
  }