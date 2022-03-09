import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Video } from './video.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Video, (video) => video.comments)
  video: number;

  @Column()
  authorId: number;

  @Column()
  authorLogin: string;

  @Column()
  message: string;
}
