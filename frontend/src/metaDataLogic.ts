import { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

export interface Reservation {
    _id: string;
    seats: string[];
  }

const MetaDataLogic = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const title = queryParams.get('title');
  const imageURL = queryParams.get('imageURL');
  const date = queryParams.get('date');
  const hall = queryParams.get('hall');
  const time = queryParams.get('time');
  const showtimeID = queryParams.get("showtimeID");
  const navigate = useNavigate(); 

  const [capacity, setCapacity] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [reservedSeats, setReservedSeats] = useState<number[]>([]);
  const [addButtonEnabled, setAddButtonEnabled] = useState(false);
  const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);


  useEffect(() => {
    if (hall) fetchHallCapacity();
    if(showtimeID) fetchReservedSeats();
  }, [hall, showtimeID]);
    
  const fetchReservedSeats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reservations/showtimereservation/${showtimeID}`);
        const data = await response.json();
    
        if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          setReservedSeats([]); 
          return;
        }
    
        const newReservedSeats = data.reduce((acc: number[], reservation: Reservation) => {
            const seatsFromReservation = reservation.seats.map((seat: string) => parseInt(seat.split(' ')[1]));
            return acc.concat(seatsFromReservation);
        }, []);
    
        setReservedSeats(newReservedSeats);
    
      } catch (error) {
        console.error('Failed to fetch reserved seats', error);
      }
  };

  const fetchHallCapacity = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reservations/${hall}`);
      const data = await response.json();
      setCapacity(data);
    } catch (error) {
      console.error('Failed to fetch hall capacity', error);
    }
  };

  const toggleSeatSelection = (seatNumber: number) => {
    setSelectedSeats(prev => {
      const index = prev.indexOf(seatNumber);
      const newSelectedSeats = index !== -1 ? prev.filter(item => item !== seatNumber) : [...prev, seatNumber];
  
      if (newSelectedSeats.length > 0) {
        const areAllSelectedSeatsReserved = newSelectedSeats.every(seat => reservedSeats.includes(seat));
        const areAllSelectedSeatsAvailable = newSelectedSeats.every(seat => !reservedSeats.includes(seat));
  
        if (!(areAllSelectedSeatsReserved || areAllSelectedSeatsAvailable)) {
          alert("Du kan kun vælge sæder fra samme reservationsstatus (enten alle reserverede eller alle ledige).");
          return prev;
        }
      }
  
      setAddButtonEnabled(newSelectedSeats.some(seat => !reservedSeats.includes(seat)));
      setDeleteButtonEnabled(newSelectedSeats.every(seat => reservedSeats.includes(seat)) && newSelectedSeats.length > 0);
  
      if (newSelectedSeats.length === 0) {
        setAddButtonEnabled(false);
        setDeleteButtonEnabled(false);
      }
  
      return newSelectedSeats;
    });
  };

  const addReservation = async () => {
    try {
        const response = await fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                showtimeID, 
                seats: selectedSeats.map(seatNumber => `Seat ${seatNumber}`)
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to add reservation');
        }

        await fetchReservedSeats();
        setSelectedSeats([]);
    } catch (error) {
        console.error('Error during reservation:', error);
    }
  };

  const deleteReservation = async () => { 
    try {
      const seatNumbers = Array.isArray(selectedSeats) ? selectedSeats.join(',') : selectedSeats;
      const response = await fetch(`http://localhost:3000/reservations/deletereservation/${showtimeID}?selectedSeats=${seatNumbers}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();  
  
      if (!response.ok) {
        throw new Error(data.message);
      }
  
      if(data.message === "Selected seats must be in the same reservation to proceed"){
        alert("You can only delete seats from the same reservation. The chosen seats are from different reservations");
      } else {
        await fetchReservedSeats(); 
        setSelectedSeats([]);  
        setDeleteButtonEnabled(false);
      }
    } catch (error) {
      console.error('Error during reservation deletion:', error);
    }
  };
  
  const homebutton = () => {
    const url = "/home"; 
    navigate(url);
  };


  return {        
    fetchReservedSeats,
    fetchHallCapacity,
    title,
    imageURL,
    date,
    hall,
    time,
    showtimeID,
    capacity,
    selectedSeats,
    setCapacity,
    setSelectedSeats,
    reservedSeats,
    setReservedSeats,
    addButtonEnabled,
    setAddButtonEnabled,
    deleteButtonEnabled,
    setDeleteButtonEnabled,
    addReservation,
    toggleSeatSelection,
    deleteReservation,
    homebutton,

  }

};

export default MetaDataLogic;
