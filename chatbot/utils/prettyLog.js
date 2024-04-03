export function prettyLog(message, type = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    const styles = {
        log: '\x1b[37m',
        info: '\x1b[34m',
        warn: '\x1b[33m',
        error: '\x1b[31m'
    };
    const reset = '\x1b[0m';
    const style = styles[type] || styles.log;

    console.log(`${style}[${timestamp}] ${message}${reset}`);
}
