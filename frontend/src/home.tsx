import './App.css';
import Starfield from './stars';
import HomeLogic from "./homelogic"

function Home() {

  const {movies, navigateToSelectedMovie, today, time } = HomeLogic();
  return (
    <div className="App bg-slate-900 min-h-screen w-full">
      <Starfield numberOfStars={300} />
  
      <p className='flex justify-end pr-20 text-white text-md'> Logged in as: Receptionist </p>
      <p className='text-white font-sans text-3xl absolute pt-40 left-80 pl-10'> Current movies going</p>
  
      <div className='flex justify-end pr-[10%] pt-40 gap-12 font-sans text-white text-3xl'>
        <p> {today} </p>
        <p> {time} </p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4 px-8 mx-auto max-w-7xl ml-80">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.title} className="shadow-lg rounded-lg w-64 h-80 m-2">
              <img src={movie.imageURL} alt={movie.title} className="w-full h-full object-cover cursor-pointer z-500 relative" onClick={() => navigateToSelectedMovie(movie)} />
            </div>
          ))
        ) : (
          <p className='text-white'>No movies available.</p>
        )}
      </div>
    </div>
  );
  
  
}

export default Home;