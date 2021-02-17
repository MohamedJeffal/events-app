import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { PgClient } from './utils/pg.client'
import { EventsResolver } from './events/events.resolver'
import { EventsService } from './events/events.service'

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [],
  providers: [PgClient, EventsService, EventsResolver],
})
export class AppModule {}
