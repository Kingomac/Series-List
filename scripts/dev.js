import { runCommand } from './util.js'

(async () => {
    const parcel = await runCommand('npx parcel serve ./src/index.html')
    const firebase = await runCommand('npx firebase emulators:start')

    function killAll() {
        parcel.kill();
        firebase.kill();
    }

    process.on('exit', killAll)
    process.on('SIGINT', killAll)
    process.on('SIGUSR1', killAll);
    process.on('SIGUSR2', killAll);
    process.on('uncaughtException', killAll);
})();