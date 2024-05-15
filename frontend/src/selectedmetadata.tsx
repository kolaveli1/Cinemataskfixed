import Starfield from "./stars";
import MetaDataLogic from "./metaDataLogic";
import "./App.css";

function SelectedMetaData() {

  const { title, imageURL, date, hall, time, capacity, selectedSeats, reservedSeats, addButtonEnabled, deleteButtonEnabled, addReservation, deleteReservation, toggleSeatSelection, homebutton} = MetaDataLogic();
  
  const renderSeats = () => {
    let rows: number;
    let seatsPerRow: number;
    let extraSeats: number = 0;
  
    if (capacity < 20) {
      rows = Math.ceil(capacity / 5);
      seatsPerRow = 5;
    } else if (capacity <= 50) {
      rows = capacity <= 20 ? 3 : 5;
      seatsPerRow = Math.floor(capacity / rows);
      extraSeats = capacity % rows;
    } else {
      rows = capacity <= 70 ? 5 : 6;
      seatsPerRow = Math.floor(capacity / rows);
      extraSeats = capacity % rows;
    }
  
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="grid grid-flow-col gap-2">
            {Array.from({ length: seatsPerRow + (rowIndex < extraSeats ? 1 : 0) }, (_, colIndex) => {
              const seatNumber = rowIndex * seatsPerRow + colIndex + 1 + (rowIndex < extraSeats ? rowIndex : extraSeats); 
              if (seatNumber > capacity) return null;
              const isReserved = reservedSeats.includes(seatNumber);
              const isSelected = selectedSeats.includes(seatNumber);
              return (
                <div key={seatNumber}
                  className={`w-12 h-12 ${isSelected ? "bg-blue-500" : isReserved ? "bg-red-500" : "bg-green-500"} hover:bg-green-700 text-white flex items-center justify-center rounded-lg shadow-md m-1 cursor-pointer transition-colors duration-300 w-8 h-8`}
                  onClick={() => toggleSeatSelection(seatNumber)}>
                  {seatNumber}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  
  return (
    <div className="bg-slate-900 min-h-screen w-full flex justify-center items-start">
      <header className="w-full max-w-4xl p-20 grid grid-cols-1 gap-4">
        <Starfield numberOfStars={400} />
        <div className="flex justify-end text-white text-md absolute top-0 right-0 mr-20">
          Logged in as: Receptionist
        </div>
        <div className="flex mt-40">
          <img src={imageURL || "defaultImageURL"} alt={title || "Movie image"} className="flex-none w-96 max-w-lg -ml-96 selecteddataimage" />
        </div>
        <div className="text-white absolute top-60 right-80 pr-20 items">
          <p className="mb-4 font-bold text-xl chooselabel"> Choose seats for {title}, in the {hall}, the {date}, at {time}</p>
          <div className="bg-black h-[530px] w-[900px] mr-80 pt-48 relative moviecanvas">
            <p className="absolute top-0 text-center text-white text-xl w-full">Movie canvas</p>
            
            {renderSeats()}
          </div>
          <button className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors mr-4 ${addButtonEnabled ? "" : "opacity-50 cursor-not-allowed"}`}
            onClick={addButtonEnabled ? addReservation : undefined}>Reserve seats</button>
          <button className={`mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-500 transition-colors ${deleteButtonEnabled ? "" : "opacity-50 cursor-not-allowed"}`}
            onClick={deleteButtonEnabled ? deleteReservation : undefined}>Delete seats</button>
        </div>      
        <button onClick={homebutton} className="z-90 absolute top-0 text-white left-0 bg-blue-500 rounded-xl mt-2 ml-2 w-24 h-12 text-sm" > Home </button>
      </header>
    </div>
  );

}

export default SelectedMetaData;
