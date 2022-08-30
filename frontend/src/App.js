import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./App.css";
import Login from "./Login";
import { fetchData, handleUpdate } from "./utils/httpClient";

function App() {
  const endDate = Date.now();
  const startDate = endDate - 1000 * 60 * 60 * 24 * 365; //substract one year
  const [sid, setSid] = useState(localStorage.getItem("sid"));
  const [data, setData] = useState(null);
  const [habit, setHabit] = useState("");

  const updateData = async (count) => {
    let res = await handleUpdate(sid, count);
    res = await res.json();
    if (res.error) {
      alert(res.error);
      return;
    }
    setData(res.data);
  };
  const handleYay = async () => {
    updateData(1);
  };

  const handleNay = async () => {
    updateData(0);
  };

  //rendered twice because strict mode is on
  useEffect(() => {
    if (!sid) return;
    fetchData(sid)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          //not authenticated
          setSid(null);
          return;
        }
        setData(res.data);
        setHabit(res.habit);
      });
  }, [sid]);

  if (!sid) {
    return <Login setSid={setSid} />;
  }

  if (!data) {
    return <p>loading</p>;
  }

  return (
    <div id="wrapper">
      <h1>githabit</h1>
      <div>
        <p>{habit}</p>
        <button onClick={handleYay}>Yay</button>
        <button onClick={handleNay}>Nay</button>
      </div>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={data}
        titleForValue={(value) => {
          return value ? `(${value.date}) Yay` : null;
        }}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          if (value.count > 0) {
            return "color-filled";
          }
          return "color-empty";
        }}
      />
    </div>
  );
}

export default App;
