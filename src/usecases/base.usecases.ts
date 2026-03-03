import { DataSource, QueryRunner } from "typeorm";

export class BaseUseCases {
  constructor(protected readonly dataSource: DataSource) {}

  async executeTransaction<T>(callback: (queryRunner: QueryRunner) => Promise<T>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const result = await callback(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
