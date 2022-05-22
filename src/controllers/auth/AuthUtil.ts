import { SUDO_EMAILS } from '../../../app.config'

export async function isEmailSudo (email: string): Promise<boolean> {
  for await (const i of SUDO_EMAILS) {
    if (typeof i === 'string') {
      if (email === i) return true
    } else if (i instanceof RegExp) {
      if (i.test(email)) return true
    }
  }
  return false
}
