import React from 'react';
import { AppBar, Toolbar, IconButton, Slider, Button, Box, Typography } from '@mui/material';
import { ColorPicker } from '@mui/x-color-picker';

export default function DrawingToolbar({ onColorChange, onBrushSizeChange, onReset }) {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Collaborative Drawing App
                </Typography>
                <ColorPicker
                    defaultValue="#000000"
                    onChange={(color) => onColorChange(color.hex)}
                    sx={{ marginRight: 2 }}
                />
                <Box sx={{ width: 150, marginRight: 2 }}>
                    <Typography variant="body2">Brush Size</Typography>
                    <Slider
                        defaultValue={5}
                        min={1}
                        max={20}
                        onChange={(e, value) => onBrushSizeChange(value)}
                    />
                </Box>
                <Button variant="contained" color="secondary" onClick={onReset}>
                    Reset Canvas
                </Button>
            </Toolbar>
        </AppBar>
    );
}
