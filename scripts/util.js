import { spawn } from 'child_process'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<void>}
 */
export async function runCommand (command) {
  console.log('Running', command)
  const process = spawn('cmd', ['/c'].concat(command.split(' ')), { stdio: 'inherit' })
  // process.stdout.on('data', (data) => { console.log(data) })
  // process.stderr.on('data', (data) => { console.log(data) })
  process.on('exit', (code) => { console.log(`Command ${command} exited with code ${code}`) })
  process.on('error', (err) => { console.log(err) })
}