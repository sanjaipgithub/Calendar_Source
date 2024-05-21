import './App.css';
import Calendar from './Calender/Calender';

function App() {
  return (
    <div className="App">
      <header className="App-header drop-shadow-2xl">
      {/* <div class="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."> */}

      <h1 className="text-3xl  text-white font-bold">Calendar</h1>
        <Calendar />
     </header>

    </div>
  );
}

export default App;
