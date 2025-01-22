"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:8000");

    // Set up canvas context
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    // Listen for draw events from the server
    socketRef.current.on("draw", (data) => drawOnCanvas(data, false));

    // Listen for reset events
    socketRef.current.on("reset", clearCanvas);

    // Listen for user notifications
    socketRef.current.on("notification", (message) => {
      addNotification(message);
    });

    // Listen for stop-drawing events
    socketRef.current.on("stop-drawing", () => {
      ctxRef.current.beginPath();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = nativeEvent;
    const data = { x: offsetX, y: offsetY, color: brushColor, size: brushSize, isDrawing: true };
    drawOnCanvas(data, true);
    socketRef.current.emit("draw", data);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    socketRef.current.emit("draw", { isDrawing: false }); // Notify other users to stop drawing
    ctxRef.current.beginPath();
  };
  
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
  
    const { offsetX, offsetY } = nativeEvent;
    const data = { x: offsetX, y: offsetY, color: brushColor, size: brushSize, isDrawing: true };
    drawOnCanvas(data, true);
    socketRef.current.emit("draw", data);
  };
  
  const drawOnCanvas = (data, emit) => {
    const { x, y, color, size, isDrawing } = data;
  
    if (!isDrawing) {
      ctxRef.current.beginPath(); // Reset path if not drawing
      return;
    }
  
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = size;
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };
  

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleReset = () => {
    clearCanvas();
    socketRef.current.emit("reset");
  };

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message]);

    // Remove the notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif !== message));
    }, 5000);
  };

  return (
    <div>
      <div style={{ textAlign: "center", margin: "10px" }}>
        <label htmlFor="color">Brush Color:</label>
        <input
          type="color"
          id="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
        />
        <label htmlFor="size">Brush Size:</label>
        <input
          type="range"
          id="size"
          min="1"
          max="10"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
        />
        <button onClick={handleReset}>Reset Canvas</button>
      </div>

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        {notifications.map((notif, index) => (
          <div
            key={index}
            style={{
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
              padding: "10px",
              margin: "5px",
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {notif}
          </div>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid black",
          display: "block",
          margin: "20px auto",
        }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
      ></canvas>
    </div>
  );
}
