import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  ENV_DB_SERVER_API,
  ENV_PROTOCOL,
} from 'src/common/const/env-keys.const';
import { MysqlService } from 'src/mysql/mysql.service';

interface ICreateCommentBody {
  postId: number;
  content: string;
}

@Injectable()
export class CommentsService {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async getCommentById(postId: number) {
    const result = await this.mysqlService.query(
      `SELECT * FROM COMMENTS WHERE post_id = ?`,
      [postId],
    );
    // console.log(result);
  }

  async deletePostAllComment(id: string) {
    const url = `${this.configService.get(ENV_PROTOCOL)}${this.configService.get(ENV_DB_SERVER_API)}/comment/post?id=${id}`;
    const commentCheckQuery = `SELECT COUNT(C.user_id) AS count FROM POSTS P LEFT JOIN COMMENTS C ON P.id = C.post_id WHERE P.id = ?`;
    const checkComment = await this.mysqlService.query(commentCheckQuery, [id]);
    if (checkComment[0].count > 0) {
      try {
        const response = await firstValueFrom(this.httpService.delete(url));
        return {
          statusCode: response.status,
          success: true,
          message: 'Delete Post All Comment',
        };
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Axios Error:', error);
          throw new InternalServerErrorException('DB_API : INTERNAL_ERROR');
        }
        throw error;
      }
    } else {
      return {
        success: true,
      };
    }
  }

  async createComment(authorId: number, body: ICreateCommentBody) {
    const url = `${this.configService.get(ENV_PROTOCOL)}${this.configService.get(ENV_DB_SERVER_API)}/comment/post`;
    const data = {
      content: body.content,
      postId: body.postId,
      user_id: authorId,
    };
    try {
      const response = await firstValueFrom(this.httpService.post(url, data));
      return {
        statusCode: response.status,
        success: true,
        message: 'Created Comment',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Axios Error:', error);
        throw new InternalServerErrorException('DB_API : INTERNAL_ERROR');
      }
      throw error;
    }
  }
}
