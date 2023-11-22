import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinodeService {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    const options = {
      region: this.configService.get<string>('linode.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('linode.accessKeyId'),
        secretAccessKey: this.configService.get<string>(
          'linode.secretAccessKey',
        ),
      },
      endpoint: this.configService.get<string>('linode.endpoint'),
      forcePathStyle: true,
    };
    this.s3 = new S3Client(options);
  }

  async uploadImage(documentId: string, base64: string): Promise<string> {
    const contentType = base64.match('^data:([a-zA-Z\\/]+);base64')?.[1];

    const buf = Buffer.from(
      base64.replace(`^data:${contentType}\/\w+;base64`, ''),
      'base64',
    );

    const params = {
      Bucket: this.configService.get<string>('linode.bucket'),
      Key: documentId,
      Body: buf,
      ContentType: contentType,
      ContentEncoding: 'base64',
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      return documentId;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to upload image');
    }
  }

  async getImage(Key: string): Promise<string> {
    const params = {
      Bucket: this.configService.get<string>('linode.bucket'),
      Key,
    };

    try {
      const command = new GetObjectCommand(params);
      const response = await this.s3.send(command);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const imageBuffer = await this.streamToBuffer(response.Body);
      const imageString = imageBuffer.toString('base64');

      return `data:image/png;base64,${imageString}`;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to retrieve image');
    }
  }

  private streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async deleteImage(name: string): Promise<void> {
    const params = {
      Bucket: this.configService.get<string>('linode.bucket'),
      Key: name,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete image');
    }
  }
}
