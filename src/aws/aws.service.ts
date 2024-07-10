import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ENV_AWS_ACCESS_KEY_ID,
  ENV_AWS_BUCKET_NAME,
  ENV_AWS_REGION,
  ENV_AWS_SECRET_ACCESS_KEY,
} from 'src/common/const/env-keys.const';
import { UtilService } from 'src/util/util.service';
import { AwsDto } from './dto/aws.dto';

@Injectable()
export class AwsService {
  s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get(ENV_AWS_REGION),
      credentials: {
        accessKeyId: this.configService.get(ENV_AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(ENV_AWS_SECRET_ACCESS_KEY),
      },
    });
  }
  async saveImage(file: Express.Multer.File, directory: string) {
    const imageName = this.utilService.getUUID();
    const ext = file.originalname.split('.').pop();

    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      throw new BadRequestException('file extension is not valid');
    }
    const awsDto: AwsDto = {
      file,
      fileName: imageName,
      ext,
      directory,
    };
    return await this.imageUploadToS3(awsDto);
  }

  async imageUploadToS3({ fileName, file, ext, directory }: AwsDto) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get(ENV_AWS_BUCKET_NAME),
      Key: `${directory}/${fileName}`,
      Body: file.buffer,
      ACL: 'bucket-owner-full-control',
      ContentType: `image/${ext}`,
    });
    try {
      await this.s3Client.send(command);
      return `https://s3.${this.configService.get(ENV_AWS_REGION)}.amazonaws.com/${this.configService.get(ENV_AWS_BUCKET_NAME)}/${directory}/${fileName}`;
    } catch (e) {
      console.error('error', e);
      return null;
    }
  }
}
