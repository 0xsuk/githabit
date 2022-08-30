import "./App.css";
import "react-calendar-heatmap/dist/styles.css";
import CalendarHeatmap from "react-calendar-heatmap";

function App() {
  const endDate = Date.now();
  const startDate = endDate - 1000 * 60 * 60 * 24 * 365; //substract one year

  const handleYay = () => {
    //ping
    fetch("http://localhost:8000/");
  };
  return (
    <div id="wrapper">
      <h1>githabit</h1>
      <div>
        <p>Didn't smoke cigarettes</p>
        <button onClick={handleYay}>Yay</button>
      </div>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={[
          { date: "2022-01-01", count: 12 },
          { date: "2022-07-22", count: 122 },
          { date: "2022-08-30", count: 38 },
          // ...and so on
        ]}
        titleForValue={(value) => {
          return value ? `(${value.date}) ${value.count}` : null;
        }}
      />
    </div>
  );
}

export default App;
