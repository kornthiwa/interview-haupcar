export type AppConfig = {
  apiUrl: string
}

declare const __APP_CONFIG__: AppConfig

export const config: AppConfig = __APP_CONFIG__
