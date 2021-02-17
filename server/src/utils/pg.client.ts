import { Client } from 'pg'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

@Injectable()
export class PgClient extends Client implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      host: process.env.PGHOST ?? '127.0.0.1',
      user: process.env.PGUSER ?? 'postgres',
      password: process.env.PGPASSWORD ?? 'mysecretpassword',
      database: process.env.PGDATABASE ?? 'postgres',
      port:
        (process.env.PGPORT ? Number(process.env.PGPORT) : undefined) ?? 5432,
    })
  }

  async onModuleInit() {
    return this.connect()
  }

  async onModuleDestroy() {
    return this.end()
  }
}
