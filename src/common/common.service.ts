import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/mysql/mysql.service';

@Injectable()
export class CommonService {
  constructor(private readonly mysqlService: MysqlService) {}
}
