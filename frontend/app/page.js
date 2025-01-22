"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Slider,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChromePicker } from "react-color";

export default function Home() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [notifications, setNotifications] = useState([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:8000");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    socketRef.current.on("draw", (data) => drawOnCanvas(data, false));
    socketRef.current.on("reset", clearCanvas);
    socketRef.current.on("notification", addNotification);
    socketRef.current.on("stop-drawing", () => ctxRef.current?.beginPath());

    return () => {
      socketRef.current.off("draw");
      socketRef.current.off("reset");
      socketRef.current.off("notification");
      socketRef.current.off("stop-drawing");
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
    if (!ctxRef.current) return;
    setIsDrawing(false);
    socketRef.current.emit("draw", { isDrawing: false });
    ctxRef.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !ctxRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    const data = { x: offsetX, y: offsetY, color: brushColor, size: brushSize, isDrawing: true };
    drawOnCanvas(data, true);
    socketRef.current.emit("draw", data);
  };

  const drawOnCanvas = (data, emit) => {
    const { x, y, color, size, isDrawing } = data;
    if (!isDrawing || !ctxRef.current) {
      ctxRef.current?.beginPath();
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
    ctxRef.current?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleReset = () => {
    clearCanvas();
    socketRef.current.emit("reset");
  };

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif !== message));
    }, 5000);
  };

  const handleOpenColorMenu = () => {
    setColorPickerOpen(true);
  };

  const handleColorChange = (color) => {
    setBrushColor(color.hex);
    setColorPickerOpen(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Collaborative Drawing App
          </Typography>
        </Toolbar>
      </AppBar>

      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <Button
          variant="contained"
          onClick={handleOpenColorMenu}
        >
          Brush Color
        </Button>

        <Typography ml={6}>Brush Size</Typography>
        <Slider
          value={brushSize}
          onChange={(e, newValue) => setBrushSize(newValue)}
          min={1}
          max={20}
          sx={{ width: 200, marginLeft: 2 }}
        />
        <Button variant="contained" color="error" onClick={handleReset} sx={{ marginLeft: 6 }}>
          Reset Canvas
        </Button>
      </Box>

      {colorPickerOpen && (
        <Box sx={{ position: "absolute", top: "45%", left: "30%", transform: "translate(-50%, -50%)", zIndex: 9999 }}>
          <ChromePicker color={brushColor} onChange={handleColorChange} />
        </Box>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <canvas
          ref={canvasRef}
          style={{
            border: "2px solid #000",
            borderRadius: "8px",
          }}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
        ></canvas>
      </Box>

      {notifications.map((notif, index) => (
        <Snackbar
          key={index}
          open
          autoHideDuration={5000}
          onClose={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="info">{notif}</Alert>
        </Snackbar>
      ))}
    </Box>
  );
}
