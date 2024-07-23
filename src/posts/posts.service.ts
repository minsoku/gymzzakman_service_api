import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { PostBodyDto } from './dto/post.dto';
import { AwsService } from 'src/aws/aws.service';
import { MysqlService } from 'src/mysql/mysql.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  ENV_DB_SERVER_API,
  ENV_PROTOCOL,
} from 'src/common/const/env-keys.const';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { QueryResult } from './types/post';

@Injectable()
export class PostsService {
  constructor(
    private readonly commonService: CommonService,
    private readonly awsService: AwsService,
    private readonly mysqlService: MysqlService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getTotalPostsCount(category: string, search: string) {
    let query = `SELECT COUNT(*) AS count FROM POSTS WHERE content LIKE '%${search}%'`;
    if (category !== '') {
      query = `SELECT COUNT(*) AS count FROM POSTS WHERE category = '${category}' AND content LIKE '%${search}%'`;
    }
    const result = await this.mysqlService.query(query);
    return result[0];
  }

  async paginatePosts(dto: PaginatePostDto) {
    const { page, category, search } = dto;
    const total = await this.getTotalPostsCount(category, search);
    const pageNum = parseInt(page, 10);
    const pageSize = 10;
    const offset = (pageNum - 1) * pageSize;
    const conditions: string[] = [];
    const params: any[] = [];

    // 카테고리 조건 추가
    if (category) {
      conditions.push(`P.category = ?`);
      params.push(category);
    }

    if (search) {
      conditions.push(`P.content LIKE ?`);
      params.push(`%${search}%`);
    }

    params.push(offset, pageSize);
    const query = `
      SELECT P.*, C.*, U.profileImage, U.nickname, CU.profileImage AS commentUserProfile, CU.nickname AS commentUserNickname
      FROM POSTS P
      LEFT JOIN COMMENTS C ON P.id = C.post_id
      LEFT JOIN USERS U ON P.author_id = U.user_id
      LEFT JOIN USERS CU ON C.user_id = CU.user_id
      WHERE 1=1
      ${conditions.length > 0 ? 'AND ' + conditions.join(' AND ') : ''}
      ORDER BY created_at DESC
      LIMIT ?, ?
      `;
    const results = (await this.mysqlService.query(
      query,
      params,
    )) as QueryResult;

    const posts = [];
    results.forEach((row) => {
      let postIndex = posts.findIndex((post) => post.id === row.id);
      if (postIndex === -1) {
        posts.push({
          id: row.id,
          author_id: row.author_id,
          title: row.title,
          content: row.content,
          category: row.category,
          lat: row.lat,
          lng: row.lng,
          created_at: row.created_at,
          updated_at: row.updated_at,
          author: {
            nickname: row.nickname,
            profileImage: row.profileImage,
          },
          comments: [],
          hashtags: [],
        });
        postIndex = posts.length - 1;
      }
      // 댓글
      if (row.comment_id) {
        posts[postIndex].comments.push({
          comment_id: row.comment_id,
          comment_content: row.comment_content,
          comment_created_at: row.comment_created_at,
          author: {
            profileImage: row.commentUserProfile,
            nickname: row.commentUserNickname,
          },
        });
      }
      // if (row.hashtag_id) {
      //   const obj = posts[postIndex].hashtags[0];
      //   const value = row.hashtag_name;
      //   let exists = false;
      //   if (obj) {
      //     exists = Object.keys(obj).some((key) => obj[key] === value);
      //   }

      //   if (!exists) {
      //     posts[postIndex].hashtags.push({
      //       name: row.hashtag_name,
      //     });
      //   }
      // }
    });
    const data = {
      posts,
      total: total.count,
    };

    return data;
  }

  async createPost(
    authorId: number,
    postDto: PostBodyDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    files?: Array<Express.Multer.File>,
  ) {
    const url = `${this.configService.get(ENV_PROTOCOL)}${this.configService.get(ENV_DB_SERVER_API)}/community/post`;
    const data = {
      title: postDto.title === '' ? '' : postDto.title,
      content: postDto.content,
      author_id: authorId,
      category: postDto.category,
      hashtags: postDto.hashtags,
      lng: postDto.lng === '' ? 0 : postDto.lng,
      lat: postDto.lat === '' ? 0 : postDto.lat,
    };
    try {
      const response = await firstValueFrom(this.httpService.post(url, data));
      return {
        statusCode: response.status,
        success: true,
        message: 'Created Post',
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
