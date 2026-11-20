import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { createAdminClient, resolveEnv } from '@supabase/server/core';
import type { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private admin: SupabaseClient | null = null;

  client(): SupabaseClient {
    if (this.admin) return this.admin;

    const resolved = resolveEnv();
    if (resolved.error) {
      throw new ServiceUnavailableException(resolved.error.message);
    }

    this.admin = createAdminClient();
    return this.admin;
  }

  async health() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      throw new ServiceUnavailableException('Supabase environment is missing');
    }

    this.client();

    const response = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
    });
    if (!response.ok) {
      throw new ServiceUnavailableException('Supabase did not respond');
    }

    const body = (await response.json()) as { name?: string; version?: string };
    return {
      connected: true,
      name: body.name ?? null,
      version: body.version ?? null,
    };
  }
}
