import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { UploadRequest } from './interfaces/upload.request.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Video)
    private readonly videosRepository: Repository<Video>,
  ) {}

  async saveVideo(
    data: UploadRequest,
    userId: number,
    userLogin: string,
    filename: string,
  ) {
    return await this.videosRepository.save({
      originalTitle: data.title,
      searchTitle: data.title.toLowerCase(),
      ownerId: userId,
      ownerLogin: userLogin,
      videoSrc: `/watch?v=${filename}`,
      previewSrc: `/${filename}.jpg`,
      tags: data.tags
        .trim()
        .split(',')
        .map((tag) => {
          return {
            originalName: tag,
            searchName: tag.toLowerCase(),
          };
        }),
    });
  }

  async updateVideoViews(id: number) {
    const candidate = await this.videosRepository.findOne({
      where: { id },
    });

    if (!candidate) {
      throw new HttpException('No video', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    candidate.views++;

    await this.videosRepository.save(candidate);
  }

  async findVideos(param: string) {
    const titleResults = await this.videosRepository.find({
      where: { searchTitle: Like(`%${param.toLowerCase()}%`) },
      relations: ['comments', 'tags'],
    });

    const tagResults = await this.videosRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.comments', 'comment')
      .leftJoinAndSelect('video.tags', 'tag')
      .where(`tag.searchName LIKE '%${param.toLowerCase()}%'`)
      .getMany();

    return {
      videos: Array.from([...titleResults, ...tagResults]).filter(
        (videoA, index, self) =>
          index === self.findIndex((videoB) => videoB.id === videoA.id),
      ),
    };
  }
}
