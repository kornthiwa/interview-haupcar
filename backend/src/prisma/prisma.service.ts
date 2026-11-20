import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  async onModuleInit() {
    const url = process.env.DATABASE_URL ?? '';
    if (url.includes('[YOUR-PASSWORD]')) {
      this.logger.warn(
        'DATABASE_URL still contains [YOUR-PASSWORD]. Prisma is set up but not connected.',
      );
      return;
    }

    await this.$connect();
    this.connected = true;
  }

  async onModuleDestroy() {
    if (this.connected) await this.$disconnect();
  }
}
