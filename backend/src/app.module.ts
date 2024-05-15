import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://vandad:DINFAR@cluster0.vnrugfk.mongodb.net/cinema?retryWrites=true&w=majority"),
    ReservationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
