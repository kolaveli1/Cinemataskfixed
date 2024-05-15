import * as mongoose from "mongoose";

export const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageURL: {type: String, required: true}
});

export interface Movie {
    title: string;
    imageURL: string;
}

export const HallSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: {type: Number, required: true},
    movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

export interface Hall {
    name: string;
    capacity: number;
    movies: mongoose.Types.ObjectId[];
}

export const ShowtimeSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    hallName: { type: String, required: true },
    date: { type: String, required: true },
    showtime: { type: String, requited: true} 
});

export interface Showtime {
    movieName: string;
    hallName: string;
    date: string;
    showtime: string;
}

export const ReservationSchema = new mongoose.Schema({
    showtimeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seats: [{ type: String, required: true }],
});

export interface Reservation {
    showtimeID: mongoose.Schema.Types.ObjectId;
    seats: string[];
}