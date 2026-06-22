declare namespace NodeJS {
  interface ProcessEnv {
    APP_NAME: string
    TOKEN: string

    SERVER_HOST: string
    SERVER_PORT: number
  }
}
