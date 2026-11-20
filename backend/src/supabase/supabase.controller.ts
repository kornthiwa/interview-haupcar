import { Controller, Get } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import { SupabaseService } from './supabase.service.js';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Public()
  @Get('health')
  health() {
    return this.supabaseService.health();
  }
}
