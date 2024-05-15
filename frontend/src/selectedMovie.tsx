 import Starfield from './stars';
import selectedMovieLogic from './selectedMovielogic';
import { Showtime} from './selectedMovielogic';

function SelectedMovie() {

  const {title, imageURL, halls, handleTimeClick, showtimeint, today, time, dateHeaders, homebutton  } = selectedMovieLogic();

  return (
    <div className="bg-slate-900 min-h-screen w-full flex justify-center items-start">
      <header className="w-full max-w-4xl p-20 grid grid-cols-1 gap-4">
        <div>
          <Starfield numberOfStars={300} />
        </div>
        <div className='flex justify-end text-white text-md absolute top-0 right-0 mr-20'>
          Logged in as: Receptionist
        </div>
        <div className='flex gap-12 font-sans absolute right-0 pr-[10%] mt-24 text-white text-3xl'>
          <p>{today}</p>
          <p>{time}</p>
        </div>
  
        <div className='flex mt-40'>
          <img src={imageURL || "defaultImageURL"} alt={title || "Movie image"} className="flex-none w-96 max-w-lg -ml-80" />
          <div className='ml-10 flex-grow'>
            <p className="text-white text-2xl font-serif font-bold ml-60 absolute my-10">Current showtimes for {title}</p>
  
            <div className="mt-40 bg-black p-5 rounded-3xl halltable absolute top-48 overflow-x-auto" style={{ height: `${halls.length > 3 ? "350px" : "auto"}`, overflowY: halls.length > 3 ? "auto" : "hidden" }}>
              <table className="table-fixed w-auto text-white min-w-full">
                <thead>
                  <tr>
                    {dateHeaders.map((date, index) => (
                      <th key={index} className={`w-1/4 px-28 py-2 bg-gray-700 ${index === 0 ? "pl-60" : ""}`}>{date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {halls.map((hallName, hallIndex) => (
                    <tr key={hallIndex} className="bg-gray-800">
                      <td className="px-4 py-4 bg-gray-800">{hallName}</td>
                      {dateHeaders.map((date, dateIndex) => {
                        const key = `${date}-${hallName.trim()}`;
                        const times = showtimeint[key] || [];
                        const sortedTimes = times.sort((a, b) => {
                          const timeA = a.showtime.split(':');
                          const timeB = b.showtime.split(':');
                          const hoursDiff = parseInt(timeA[0], 10) - parseInt(timeB[0], 10);
                          if (hoursDiff !== 0) {
                            return hoursDiff;
                          }
                          return parseInt(timeA[1], 10) - parseInt(timeB[1], 10);
                        });
  
                        return (
                          <td key={dateIndex} className="py-2 bg-gray-800">
                            <div className="flex overflow-x-auto whitespace-nowrap -ml-60 gap-2 px-1 py-1" style={{ scrollbarWidth: "thin", width: "200px" }}>
                              {sortedTimes.length > 0 ? sortedTimes.map((showtime: Showtime, timeIndex: number) => (
                                <span key={timeIndex} className="cursor-pointer bg-white text-black px-3 py-1 rounded-xl" onClick={() => handleTimeClick(date, hallName, showtime.showtime, showtime._id)}>
                                  {showtime.showtime}
                                </span>
                              )) : <span className="text-white">No showtimes this day</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <button onClick={homebutton} className='z-90 absolute top-0 text-white left-0 bg-blue-500 rounded-xl mt-2 ml-2 w-20 h-8' > Home </button>
      </header>
    </div>
  );
  
}

export default SelectedMovie;