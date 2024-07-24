import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/users/decorator/user.decorator';
import { PostBodyDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPost(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FilesInterceptor('files', 3))
  async postPost(
    @User('user_id') userId: number,
    @Body() body: PostBodyDto,
    @UploadedFile() files: Array<Express.Multer.File>,
  ) {
    try {
      if (body.title === '' || body.content === '' || body.category === '') {
        throw new HttpException(
          'NOT_VALID_INPUT_VALUE',
          HttpStatus.BAD_REQUEST,
        );
      }

      const post = await this.postsService.createPost(userId, body, files);

      return {
        post,
        success: true,
        message: 'success',
      };
    } catch (err) {
      console.error(err);
      return {
        message: err.response.message,
        success: false,
        statusCode: err.response.statusCode,
      };
    }
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deletePost(@User('user_id') userId: number, @Param('id') id: string) {
    return this.postsService.deletePost(userId, id);
  }
}
