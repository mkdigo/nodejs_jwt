import crypto from 'crypto';

export default class AuthHelper {
  public static makeHash(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
  }

  public static makeSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
