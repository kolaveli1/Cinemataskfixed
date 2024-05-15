import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Movie, Hall, Showtime, Reservation } from "./reservations.model";

@Injectable()
export class ReservationService {
    constructor(
        @InjectModel("Movie") private readonly movieModel: Model<Movie>,
        @InjectModel("Hall") private readonly hallModel: Model<Hall>,
        @InjectModel("Showtime") private readonly showtimeModel: Model<Showtime>,
        @InjectModel("Reservation") private readonly reservationModel: Model<Reservation>
    ) {}

    async getAllMovies() {
        return await this.movieModel.find().exec();
    }

    async getHallsForMovie(movieTitle: string) {
        try {
            const movie = await this.movieModel.findOne({ title: movieTitle });
            if (!movie) {
                console.log("Ingen film fundet med titlen:", movieTitle);
                return [];
            }
            const halls = await this.hallModel.find({ movies: { $in: [movie._id] } }, { name: 1 }).exec(); 
            const hallNames = halls.map(hall => hall.name);
            return hallNames;
        } catch (error) {
            console.error("Fejl ved hentning af sale:", error);
            throw error;
        }
    }

    async getHallCapacity(hallName: string) {
        try {
            const hall = await this.hallModel.findOne({ name: hallName });
            if (!hall) {
                return []; 
            }
            return hall.capacity;
        } catch (error) {
            console.error("Fejl ved hentning af hall capacity", error);
            throw error;
        }
    }
    
    async getShowtimes(movieName: string, hallName: string, date: string, showtime: string) {
        return await this.showtimeModel.find({
            movieName: movieName,
            hallName: hallName,
            date: date,
            showtime: showtime
        }).exec();
    }

    async getShowtimesForMovie(movieName: string) {
        try {
            const movie = await this.movieModel.findOne({ title: movieName });
            if (!movie) {
                return [];
            }   
    
            const showtimes = await this.showtimeModel.find(
                { movieName: movieName },
                { hallName: 1, date: 1, showtime: 1 }
            ).exec();


            const showtimesdata = showtimes.map(showtime => ({
                hallName: showtime.hallName,
                date: showtime.date,
                showtime: showtime.showtime,
                _id: showtime._id
            }));
            
            return showtimesdata;

        } catch (error) {
            console.error("Ingen showtimes for den her film", error);
            throw error;
        }
    }
    
    async addReservation(showtimeID: string, seats: string[]) {
        const ObjectId = require("mongoose").Types.ObjectId;
        const newReservation = new this.reservationModel({
            showtimeID: new ObjectId(showtimeID), 
            seats
        });
        const result = await newReservation.save();
        return result;
    }
    
    async deleteSeatsFromReservation(showtimeID: string, seatNumbers: string[]): Promise<string> {
        const seatNumbersWithPrefix = seatNumbers.map(seat => "Seat " + seat);
    
        try {
            const showtimeObjectId = new mongoose.Types.ObjectId(showtimeID);
    
            const reservations = await this.reservationModel.find({
                showtimeID: showtimeObjectId,
                seats: { $in: seatNumbersWithPrefix }
            });

            if (reservations.length === 0) {
                return "No reservations found with the specified seat numbers.";
            }
    
            let reservationMap = new Map();
            reservations.forEach(res => {
                res.seats.forEach(seat => {
                    if (seatNumbersWithPrefix.includes(seat)) {
                        let existing = reservationMap.get(seat);
                        if (existing && existing !== res._id.toString()) {
                            console.error("Selected seats span multiple reservations.");
                            throw new Error("Selected seats must be in the same reservation to proceed.");
                        }
                        reservationMap.set(seat, res._id.toString());
                    }
                });
            });
    
            const allReservations = new Set(reservationMap.values());
            if (allReservations.size > 1) {
                return "Selected seats must be in the same reservation to proceed.";
            }
    
            const reservationID = allReservations.values().next().value;
            const reservation = reservations.find(res => res._id.toString() === reservationID);
            const  updatedSeats = reservation.seats.filter(seat => !seatNumbersWithPrefix.includes(seat));
    
            if (updatedSeats.length === 0) {
                await this.reservationModel.deleteOne({ _id: reservation._id });
            } else {
                reservation.seats = updatedSeats;
                await reservation.save();
            }
    
            return "Selected seats successfully deleted from reservation.";
        } catch (error) {
            console.error("Error accessing database:", error);
            throw error;
        }
    }
    
    async getReservationsForShowtime(showtimeID: string) {
        try {
            const reservations = await this.reservationModel.find({ showtimeID }).exec();
            if (reservations.length > 0) {
                return reservations;
            } else {
                return { message: "No reservations found for this showtime." };
            }
        } catch (error) {
            console.error("Error fetching reservations for showtime:", error);
            throw error;
        }
    }
    
    async addMovie(createMovieDto: { title: string, imageURL: string}) {
        const newMovie = new this.movieModel(createMovieDto);
        return await newMovie.save();
    }

    async addHall(createHallDto: { name: string; capacity: number; }) {
        const newHall = new this.hallModel(createHallDto);
        return await newHall.save();
    }

    async addShowtime(createShowtimeDto: { movieName: string; hallName: string; date: string; showtime: string; }) {
        try {
            const movie = await this.movieModel.findOne({ title: createShowtimeDto.movieName });
            if (!movie) {
                throw new Error("Movie not found");
            }
    
            const existingShowtime = await this.showtimeModel.findOne({
                hallName: createShowtimeDto.hallName,
                date: createShowtimeDto.date,
                showtime: createShowtimeDto.showtime
            });
    
            if (existingShowtime) {
                return { status: "error", message: "This hall is already booked for another movie at the specified time." };
            }
    
            const newShowtime = new this.showtimeModel({
                movieName: createShowtimeDto.movieName,
                hallName: createShowtimeDto.hallName,
                date: createShowtimeDto.date,
                showtime: createShowtimeDto.showtime
            });
            
            await newShowtime.save();
            return { status: "success", message: "Showtime added successfully" };
    
        } catch (error) {
            console.error("Failed to add showtime:", error);
            return { status: "error", message: "Internal Server Error" };
        }
    }
}
