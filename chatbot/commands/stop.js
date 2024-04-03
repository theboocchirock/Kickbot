import { setAcceptPlayCommand,getAcceptPlayCommand } from "../utils/playState.js";
import { prettyLog } from "../utils/prettyLog.js";

export function stopCommand(){
    setAcceptPlayCommand(false);
    prettyLog('!play 명령어 처리가 중지되었습니다.', 'info');
    console.log(getAcceptPlayCommand())
}