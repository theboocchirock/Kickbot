import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 29523;

app.use(bodyParser.json());

app.post('/api/addvideo', (req, res) => {
    const { video_id } = req.body;

    if (!video_id) {
        return res.status(400).json({ error: 'video_id가 없습니다.' });
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

    data.push({ video_id });

    try {
        fs.writeFileSync('./server/youtubeLink.json', JSON.stringify(data, null, 2));
        console.log(JSON.stringify({ video_id }));
        res.status(200).json({ message: '유튜브 링크가 성공적으로 추가되었습니다.' });
    } catch (err) {
        console.error('파일을 쓰는 중 오류 발생:', err);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});



app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});
