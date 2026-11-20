import { Module } from '@nestjs/common';
import { SupabaseController } from './supabase.controller.js';
import { SupabaseService } from './supabase.service.js';

@Module({
  controllers: [SupabaseController],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
