# Kick 채팅 봇
구슬치기 Kick 연동<br>
무료 영도 기능(미구현)<br>
경고: 아직 제대로 작동안함<br>

# 설치

1. 이 저장소 복사
```bash
git clone https://github.com/theboocchirock/Kickbot.git
```

2. node.js 라이브러리 설치
```bash
npm install
```
3. settings.json.example 파일명을 settings.json으로 바꾸고 킥 채널 아이디 입력

4. 시작<br>
4-1. 시작(명령어 받는)
```bash
node ./chatbot/index.js
```
4-2. 시작(영도 서버)
```bash
node ./server/index.js
```

# 구슬치기 사용법
!play<br>
그 잘 아시지 않습니까<br>
!reset <br>
참여자 초기화하고 다시 참여자받음 <br>
!stop <br>
참여자 받기를 그만두다.
1. 설정 눌러 <br>
<img src="https://github.com/theboocchirock/Kickbot/blob/main/marble1.png?raw=true">

2. Use Custom Names 체크후 Add Names 클릭 <br>
<img src="https://github.com/theboocchirock/Kickbot/blob/main/marble2.png?raw=true">

3. Open누르고 marble.csv 파일 불러오셈 <br>
<img src="https://github.com/theboocchirock/Kickbot/blob/main/marble3.png?raw=true">

4. 맵 선택후 Race Type Bot 선택, Max Racer는 Name Count만큼, Play클릭 <br>
<img src="https://github.com/theboocchirock/Kickbot/blob/main/marble4.png?raw=true">

5. 즐겜

# 주의
vpn을 키면 높은 확률로 차단먹음<br>
터널링을 사용해 node 명령를 실행하는 프로그램(cmd)은 vpn에서 예외처리 하는게 바랍직합니다<br>
kick 사이트 2개이상 켜두면 높은 확률로 차단먹음

# 라이센스
MIT 라이센스입니다 (이거로 하라고 배움)
