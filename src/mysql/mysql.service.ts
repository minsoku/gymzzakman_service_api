import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2';
import {
  ENV_DB_DATABASE_NAME,
  ENV_DB_HOST,
  ENV_DB_PASSWORD,
  ENV_DB_PORT,
  ENV_DB_USERNAME,
} from 'src/common/const/env-keys.const';

@Injectable()
export class MysqlService {
  private connection: mysql.Connection;

  constructor(private readonly configService: ConfigService) {
    this.connection = mysql.createConnection({
      host: this.configService.get(ENV_DB_HOST),
      port: this.configService.get(ENV_DB_PORT),
      user: this.configService.get(ENV_DB_USERNAME),
      password: this.configService.get(ENV_DB_PASSWORD),
      database: this.configService.get(ENV_DB_DATABASE_NAME),
    });

    this.connection.connect((err) => {
      if (err) {
        console.error('Error connection to database: ', err);
        return;
      }
    });
  }

  async query(_query: string, values?: any[]) {
    return new Promise((resolve, reject) => {
      this.connection.query(_query, values, (err, res) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }
}
