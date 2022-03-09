import { MigrationInterface, QueryRunner } from 'typeorm';

export class entities1646836357686 implements MigrationInterface {
  name = 'entities1646836357686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "tags" (
                "id" SERIAL NOT NULL,
                "original_name" character varying NOT NULL,
                "search_name" character varying NOT NULL,
                CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "videos" (
                "id" SERIAL NOT NULL,
                "original_title" character varying NOT NULL,
                "search_title" character varying NOT NULL,
                "owner_id" integer NOT NULL,
                "owner_login" character varying NOT NULL,
                "video_src" character varying NOT NULL,
                "preview_src" character varying NOT NULL,
                "likes" integer NOT NULL DEFAULT '0',
                "dislikes" integer NOT NULL DEFAULT '0',
                "views" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" SERIAL NOT NULL,
                "author_id" integer NOT NULL,
                "author_login" character varying NOT NULL,
                "message" character varying NOT NULL,
                "video_id" integer,
                CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "video_tags" (
                "video_id" integer NOT NULL,
                "tag_id" integer NOT NULL,
                CONSTRAINT "PK_2f81b8c0221388d4c33d7892a1f" PRIMARY KEY ("video_id", "tag_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e27933328455988a734bf02575" ON "video_tags" ("video_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_b2d90b3d034e87bde8dd51788d" ON "video_tags" ("tag_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_0528681f0d2c6e89116dd3eb3f4" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "video_tags"
            ADD CONSTRAINT "FK_e27933328455988a734bf025751" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "video_tags"
            ADD CONSTRAINT "FK_b2d90b3d034e87bde8dd51788d3" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "video_tags" DROP CONSTRAINT "FK_b2d90b3d034e87bde8dd51788d3"
        `);
    await queryRunner.query(`
            ALTER TABLE "video_tags" DROP CONSTRAINT "FK_e27933328455988a734bf025751"
        `);
    await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_0528681f0d2c6e89116dd3eb3f4"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_b2d90b3d034e87bde8dd51788d"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e27933328455988a734bf02575"
        `);
    await queryRunner.query(`
            DROP TABLE "video_tags"
        `);
    await queryRunner.query(`
            DROP TABLE "comments"
        `);
    await queryRunner.query(`
            DROP TABLE "videos"
        `);
    await queryRunner.query(`
            DROP TABLE "tags"
        `);
  }
}
