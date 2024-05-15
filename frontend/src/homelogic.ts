import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const HomeLogic = () => {
  const [movies, setMovies] = useState<Array<{ title: string; imageURL: string }>>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    fetchMovies();
    return () => clearInterval(timer);
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3000/reservations/movies");
      if (!response.ok) {
        throw new Error("HTTP error");
      }
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2,"0");
    return `${hours}:${minutes}`;
  };
  
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const month = monthNames[date.getMonth()];
    return `${day}. ${month}`;
  };

  const navigateToSelectedMovie = (movie: { title: string; imageURL: string }) => {
    const url = `/selectedMovie?title=${encodeURIComponent(movie.title)}&imageURL=${encodeURIComponent(movie.imageURL)}`;
    navigate(url);
  };

  const today = formatDate(currentDate);
  const time = formatTime(currentDate);

  return {movies, fetchMovies, formatTime, formatDate, navigateToSelectedMovie, today, time };
};

export default HomeLogic;