import { Controller, Post, Body, Get, Delete, Param, Query } from "@nestjs/common";
import { ReservationService } from "./reservations.service";

@Controller("reservations")
export class ReservationController {
    constructor(private reservationsService: ReservationService) {}

    @Post()
    async addReservation(
        @Body("showtimeID") showtimeID: string,
        @Body("seats") seats: string[]
    ) {
        return await this.reservationsService.addReservation(showtimeID, seats);
    }

    @Delete("deletereservation/:showtimeID")
    async deleteSeatsFromReservation(
        @Param("showtimeID") showtimeID: string,
        @Query("selectedSeats") selectedSeats: string
    ) {
        let seatNumbers: string[];
        if (typeof selectedSeats === "string") {
            seatNumbers = selectedSeats.split(",");
        } else {
            seatNumbers = [];
        }
    
        try {
            const result = await this.reservationsService.deleteSeatsFromReservation(showtimeID, seatNumbers);
            if (result === "No reservations found with the specified seat numbers.") {
                throw new Error("Error");
            }
            return { message: result };
        } catch (error) {
            throw new Error("Failed to delete reservation: " + error.message);
        }
    }
    
    @Get("showtimereservation/:showtimeID")
    async getReservationsForShowtime(@Param("showtimeID") showtimeID: string) {
        return await this.reservationsService.getReservationsForShowtime(showtimeID);
    }
    
    @Get("movies")
    async getAllMovies() {
        const movies = await this.reservationsService.getAllMovies();
        return await movies;
    }

    @Get("halls/:title")
    async getHallsForMovie(@Param("title") title: string) {
        return await this.reservationsService.getHallsForMovie(title);
    }

    @Get(":hallName")
    async getHallCapacity(@Param("hallName") hallName: string) {
        return await this.reservationsService.getHallCapacity(hallName);
    }
    
    @Get("showtimes")
    async getShowtimes(@Query("movieName") movieName: string, @Query("hallName") hallName: string, @Query("date") date: string, @Query("showtime") showtime: string) {
        return await this.reservationsService.getShowtimes(movieName, hallName, date, showtime);
    }

    @Get("showtimes/:title") 
    async getShowtimeForMovie(@Param("title") title: string) {
        return await this.reservationsService.getShowtimesForMovie(title);
    }

    @Post("addMovie")
    async addMovie(@Body() createMovieDto: { title: string, imageURL: string }) {
        return await this.reservationsService.addMovie(createMovieDto);
    }

    @Post("addHall")
    async addHall(@Body() createHallDto: { name: string; capacity: number }) {
        return await this.reservationsService.addHall(createHallDto);
    }

    @Post("addShowtime")
    async addShowtime(@Body() createShowtimeDto: { movieName: string; hallName: string; date: string; showtime: string }) {
        return await this.reservationsService.addShowtime(createShowtimeDto);
    }
}
