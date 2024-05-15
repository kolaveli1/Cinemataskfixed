import { Module } from "@nestjs/common";
import { ReservationController } from "./reservations.controller";
import { ReservationService } from "./reservations.service";
import {MongooseModule} from "@nestjs/mongoose";
import { MovieSchema, HallSchema, ShowtimeSchema, ReservationSchema } from "./reservations.model";


@Module({
    imports: [MongooseModule.forFeature([
        { name: 'Movie', schema: MovieSchema },
        { name: 'Hall', schema: HallSchema },
        { name: 'Showtime', schema: ShowtimeSchema },
        { name: 'Reservation', schema: ReservationSchema }])],
    controllers: [ReservationController],
    providers: [ReservationService],
})

export class ReservationsModule{}