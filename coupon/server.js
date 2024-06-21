import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes, createCipheriv } from 'crypto';
import { createReadStream, createWriteStream, promises as fsPromises } from 'fs';

const app = express();
const port = 3000;

// 현재 파일(__filename)과 디렉토리(__dirname) 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 경로 설정 (CSS, JavaScript 등)
app.use(express.static(path.join(__dirname, 'public')));

// 'coupon' 폴더 안에 'uploads' 디렉토리 경로 설정
const uploadDir = path.join(__dirname, 'uploads');

// 서버 시작 시 'uploads' 디렉토리가 존재하지 않으면 생성
async function initializeUploadDirectory() {
  try {
    await fsPromises.access(uploadDir); // 디렉토리 접근 권한 확인
    console.log(`'uploads' 디렉토리 접근 성공`);
  } catch (error) {
    // 디렉토리가 없는 경우 생성
    try {
      await fsPromises.mkdir(uploadDir, { recursive: true }); // recursive 옵션을 사용하여 중간 경로가 없을 경우 생성
      console.log(`'uploads' 디렉토리 생성 완료`);
    } catch (err) {
      console.error(`'uploads' 디렉토리 생성 실패: ${err}`);
      throw err;
    }
  }
}

initializeUploadDirectory()
  .then(() => {
    console.log(`'uploads' 디렉토리가 준비되었습니다.`);
  })
  .catch(err => {
    console.error(`'uploads' 디렉토리를 준비하는 중 오류가 발생했습니다: ${err}`);
  });

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // uploadDir 변수를 사용하여 절대 경로를 지정
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// AES 암호화에 사용할 키 생성
const key = randomBytes(32);

// 이미지 암호화 함수
async function encryptImage(imagePath, outputPath) {
  return new Promise((resolve, reject) => {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    const input = createReadStream(imagePath);
    const output = createWriteStream(outputPath);

    input.pipe(cipher).pipe(output);

    output.on('finish', () => {
      resolve({ iv: iv.toString('hex') });
    });

    output.on('error', reject);
  });
}

app.get('/', (req, res) => {
    res.render('index', { encryptedImagePath: null }); // 초기화할 때 encryptedImagePath 변수를 null로 전달
  });
  
app.post('/upload', upload.single('image'), async (req, res) => {
const imagePath = req.file.path;
const encryptedFileName = `encrypted_${req.file.originalname}`;
const encryptedImagePath = path.join('uploads', encryptedFileName); // 암호화된 이미지의 상대 경로

const { iv } = await encryptImage(imagePath, path.join(uploadDir, encryptedFileName));

res.render('index', { encryptedImagePath: encryptedImagePath, key: key.toString('hex'), iv });
});
app.get('/decrypt', (req, res) => {
    res.render('decrypt');
});
  
// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
