import React, { useState, useEffect } from "react";

function App() {
  const [points, setPoints] = useState([]);
  const [inputValue, setInputValue] = useState(3);
  const [displayPoints, setDisplayPoints] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [nextPointId, setNextPointId] = useState(1);
  const [gameState, setGameState] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [pointColors, setPointColors] = useState({});

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const generateRandomPoints = (numPoints) => {
    if (numPoints > 0) {
      const newPoints = Array.from({ length: numPoints }, (_, index) => ({
        id: index + 1,
        x: Math.random() * 90,
        y: Math.random() * 90,
      }));
      newPoints.sort((a, b) => b.id - a.id);
      setPoints(newPoints);
      setDisplayPoints(newPoints);
      setElapsedTime(0);
      setNextPointId(1);
      setGameState("");
      setPointColors({});

      const id = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
      setIntervalId(id);
    }
  };

  const handleRemovePoint = (pointToRemove) => {
    if (pointToRemove !== nextPointId) {
      setPointColors((prevColors) => ({
        ...prevColors,
        [pointToRemove]: "red",
      }));
      setGameState("GAME OVER");
      clearInterval(intervalId);
      return;
    }


    setPointColors((prevColors) => ({
      ...prevColors,
      [pointToRemove]: "#27ae60",
    }));

    setTimeout(() => {
      const remainingPoints = displayPoints.filter((point) => point.id !== pointToRemove);
      setDisplayPoints(remainingPoints);
      setNextPointId(nextPointId + 1);
      setPointColors((prevColors) => {
        const newColors = { ...prevColors };
        delete newColors[pointToRemove];
        return newColors;
      });

      if (remainingPoints.length === 0) {
        clearInterval(intervalId);
        setGameState("ALL CLEARED");
      }
    }, 300);
  };

  const handleRestart = () => {
    clearInterval(intervalId);
    generateRandomPoints(inputValue);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      width: "550px",
      margin: "auto"
    }}>
      <div>
        {gameState ? (
          <h1
            style={{
              textAlign: "center",
              color: gameState === "GAME OVER" ? "red" : "green",
            }}
          >
            {gameState}
          </h1>
        ) : (
          <h1 style={{ textAlign: "center" }}>LET'S PLAY</h1>
        )}
        <div style={{ display: "flex", gap: "20px", marginBottom: "10px", marginRight: "10px" }}>
          <label>Points: </label>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            style={{ width: "40px" }}
            min="1"
          />
          <button onClick={handleRestart}>
            Restart
          </button>
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          <label>Time: </label>
          <span>{elapsedTime.toFixed(1)}s</span>
        </div>

        <div
          style={{
            position: "relative",
            width: "450px",
            height: "400px",
            border: "2px solid #52707b",
            borderRadius: "4px",
            margin: "20px 0",
          }}
        >
          {displayPoints.map((point) => (
            <div
              key={point.id}
              onClick={() => handleRemovePoint(point.id)}
              style={{
                position: "absolute",
                top: `${point.y}%`,
                left: `${point.x}%`,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: pointColors[point.id] || "#fff",
                border: "1px solid black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {point.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
