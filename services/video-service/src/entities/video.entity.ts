import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';

@Entity('videos')
export class Video extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalTitle: string;

  @Column()
  searchTitle: string;

  @Column()
  ownerId: number;

  @Column()
  ownerLogin: string;

  @Column()
  videoSrc: string;

  @Column()
  previewSrc: string;

  @Column({
    default: 0,
  })
  likes: number;

  @Column({
    default: 0,
  })
  dislikes: number;

  @Column({
    default: 0,
  })
  views: number;

  @OneToMany(() => Comment, (comment) => comment.video, { cascade: true })
  comments: Comment[];

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: 'video_tags',
    joinColumn: {
      name: 'video_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
