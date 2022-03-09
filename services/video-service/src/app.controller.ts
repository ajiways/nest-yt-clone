import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { createReadStream, existsSync, statSync } from 'fs';
import { resolve } from 'path';
import { AppService } from './app.service';
import {
  SearchQueryInterface,
  WatchQueryInterface,
} from './interfaces/query.interface';
import { UploadRequest } from './interfaces/upload.request.interface';
import {
  previewOptions,
  previewStorage,
  videoOptions,
  videoStorage,
} from './misc/storage';

@Controller('videos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/upload/preview')
  @UseInterceptors(
    FileInterceptor('preview', { storage: previewStorage, ...previewOptions }),
  )
  uploadPreview(@UploadedFile() preview: Express.Multer.File) {
    if (!preview) {
      throw new HttpException(
        'Wrong file extention (preview)',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('video', { storage: videoStorage, ...videoOptions }),
  )
  async uploadVideo(
    @UploadedFile() video: Express.Multer.File,
    @Body() data: UploadRequest,
  ) {
    if (!video) {
      throw new HttpException(
        'Wrong file extention (video)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = 1;
    const userLogin = 'UserLogin';

    console.log(data);

    await this.appService.saveVideo(data, userId, userLogin, video.filename);

    return {
      status: 200,
      message: 'Видео успешно загружено!',
      videoName: data.title,
      fileId: video.filename,
    };
  }

  @Get('/watch')
  @HttpCode(206)
  watchVideo(
    @Query() query: WatchQueryInterface,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): StreamableFile {
    const range = req.headers.range;

    if (!range) {
      throw new HttpException('No range header', HttpStatus.BAD_REQUEST);
    }

    const videoPath = resolve(`./files/videos/${query.v}`);

    if (!existsSync(videoPath)) {
      throw new HttpException(
        'No video with provided id',
        HttpStatus.NOT_FOUND,
      );
    }

    const videoSize = statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    res.set(headers);

    const videoStream = createReadStream(videoPath, { start, end });
    return new StreamableFile(videoStream);
  }

  @Post('/watched')
  async updateViewsCount(@Body('id') id: number) {
    await this.appService.updateVideoViews(id);
  }

  @Get('/list')
  async sendVideoList(@Query() query: SearchQueryInterface) {
    console.log(query);

    return await this.appService.findVideos(query.search);
  }
}
