import fs from 'fs';

// CSV 파일에 사용자 이름을 추가하는 함수
export function appendToCSV(username) {
    fs.appendFileSync('./chatbot/marble.csv', username + '\n');
}