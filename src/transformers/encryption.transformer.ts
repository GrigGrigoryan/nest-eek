import { ValueTransformer } from 'typeorm';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

const ALGORITHM = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = Number(process.env.ENCRYPTION_IV_LENGTH) || 16;

export class EncryptionTransformer implements ValueTransformer {
  private readonly logger: Logger = new Logger(EncryptionTransformer.name);
  to(value: any): string {
    if (value === null || value === undefined) {
      return value;
    }

    let stringValue = value;

    // If the value is an object, stringify it as JSON
    if (typeof value === 'object') {
      stringValue = JSON.stringify(value);
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const encryptionBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv(ALGORITHM, encryptionBuffer, iv);
    const encrypted =
      cipher.update(stringValue, 'utf8', 'hex') + cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  from(value: string): any {
    if (!value) {
      return value;
    }

    const [ivHex, encrypted] = value.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptionBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, encryptionBuffer, iv);
    const decrypted =
      decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

    try {
      // Attempt to parse the decrypted value as JSON
      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.debug(error);
      // If parsing as JSON fails, return the decrypted string
      return decrypted;
    }
  }
}
