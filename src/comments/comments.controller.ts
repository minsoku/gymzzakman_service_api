import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { User } from 'src/users/decorator/user.decorator';

@Controller('posts-comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getAllCommnetsById(@Param('id') id: number) {
    return this.commentsService.getCommentById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  async postComment(
    @User('user_id') userId: number,
    @Body() body: { content: string; postId: number },
  ) {
    try {
      const post = await this.commentsService.createComment(userId, body);
      const comment = await this.commentsService.getCommentById(body.postId);

      return {
        post,
        success: true,
        message: '댓글이 성공적으로 작성되었습니다.',
        data: comment,
      };
    } catch (err) {
      console.error(err);
      throw new Error('postComment : INTERNAL_SERVER_ERROR');
    }
  }
}
