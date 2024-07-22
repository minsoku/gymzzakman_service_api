import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/mysql/mysql.service';

@Injectable()
export class CommonService {
  constructor(private readonly mysqlService: MysqlService) {}
  async paginate() {
    const query = `
    SELECT 
        POSTS.id,
        POSTS.title,
        POSTS.content,
        POSTS.category,
        POSTS.created_at AS createdAt,
        POSTS.view_count AS viewCount,
        POSTS.like_count AS likeCount,
        USERS.id AS user_id,
        USERS.nickname AS user_nickname,
        USERS.profile_image AS user_profile_image,
        hashtags,
        comments,
        comment_author.nickname AS comment_author_nickname,
        comment_author.profile_image AS comment_author_profile_image
        FROM POSTS
        LEFT JOIN USERS ON POSTS.author_id = USERS.id
        LEFT JOIN POSTS_HASHTAGS ON POSTS.id = POSTS_HASHTAGS.post_id
        LEFT JOIN HASHTAGES ON post_hashtags.hashtag_id = HASHTAGES.id
        LEFT JOIN COMMNETS ON POSTS.id = COMMNETS.post_id
        LEFT JOIN USERS AS comment_author ON comments.author_id = comment_author.id
        WHERE {WHERE_CLAUSE}
        ORDER BY {ORDER_CLAUSE}
        LIMIT {SKIP}, {TAKE};
    `;
    // this.mysqlService.query();
  }

//   private composeFindOptions<T extends Base
}
