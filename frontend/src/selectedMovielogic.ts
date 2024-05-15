import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface Showtime {
  hallName: string;
  date: string;  
  showtime: string;
  _id: string;
}

export interface Showtime1 {
  [key: string]: Showtime[]; 
}

const SelectedMovieLogic = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [halls, setHalls] = useState<string[]>([]);
  const [showtimeint, setShowtimeint] = useState<Showtime1>({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const title = queryParams.get('title') || 'Default Title';
  const imageURL = queryParams.get('imageURL') || 'Default Image URL';
  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    fetchHalls();
    fetchShowtimes();
    return () => clearInterval(timer);
  }, []);

  
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date, addDays: number = 0) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid date provided:", date);
      return "";
    }

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + addDays);
    const day = newDate.getDate().toString().padStart(2, '0');
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    const month = monthNames[newDate.getMonth()];
    return `${day} ${month.substring(0, 3)}`; 
  };

  const fetchHalls = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reservations/halls/${title}`);
      if (!response.ok) {
        throw new Error("HTTP error");
      }
      const hallNames = await response.json();
        setHalls(hallNames); 
    } catch (error) {
      console.error("Error fetching hall names:", error);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reservations/showtimes/${title}`);
      if (!response.ok) {
        throw new Error("HTTP error");
      }
      const fetchedShowtimes: Showtime[] = await response.json(); 

      const newShowtimeSchedule = fetchedShowtimes.reduce<Showtime1>((acc, showtime) => {
        const hallName = showtime.hallName.trim();
        const key = `${showtime.date}-${hallName}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(showtime);
        console.log(acc);
        return acc;
      }, {});

      setShowtimeint(newShowtimeSchedule);
    } catch (error) {
      console.error("Error fetching showtimes", error);
    }
  };

  const handleTimeClick = (date: string, hall: string, time: string, showtimeID: string) => {
    const url = `/selectedMetaData?title=${encodeURIComponent(title)}&imageURL=${encodeURIComponent(imageURL)}&date=${encodeURIComponent(date)}&hall=${encodeURIComponent(hall)}&time=${encodeURIComponent(time)}&showtimeID=${encodeURIComponent(showtimeID)}`; 
    navigate(url);
  };

  const homebutton = () => {
    const url = "/home"; 
    navigate(url);
  };

  const today = formatDate(currentDate, 0);
  const time = formatTime(currentDate);
  const dateHeaders = Array.from({ length: 7 }, (_, i) => formatDate(currentDate, i));

  return { formatDate, formatTime, title, imageURL, halls, handleTimeClick, showtimeint, today, time, dateHeaders, homebutton };
};

export default SelectedMovieLogic;
