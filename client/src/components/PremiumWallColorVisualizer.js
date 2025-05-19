import React, { useState, useEffect, useRef } from 'react';
import './PremiumWallColorVisualizer.css';

// Paint color data with names, color codes, and types
const paintColors = {
  standard: [
    { name: "Cloud White", hex: "#F8F8F8", code: "SW-001" },
    { name: "Dove Gray", hex: "#D9D9D9", code: "SW-002" },
    { name: "Sand Dollar", hex: "#E8DCC9", code: "SW-003" },
    { name: "Pale Sky", hex: "#C4D7E6", code: "SW-004" },
    { name: "Mint Whisper", hex: "#D6E9D8", code: "SW-005" },
    { name: "Soft Blush", hex: "#F7E6E6", code: "SW-006" },
    { name: "Warm Beige", hex: "#E4D5C5", code: "SW-007" },
    { name: "Gentle Gray", hex: "#D5D5D0", code: "SW-008" }
  ],
  premium: [
    { name: "Alabaster White", hex: "#F5F0E6", code: "SW-101" },
    { name: "Lagoon Blue", hex: "#87CEEB", code: "SW-102" },
    { name: "Sage Garden", hex: "#A2C095", code: "SW-103" },
    { name: "Vintage Rose", hex: "#D8A3A6", code: "SW-104" },
    { name: "Coastal Sand", hex: "#D7C29E", code: "SW-105" },
    { name: "Smoke Gray", hex: "#A9A9A9", code: "SW-106" },
    { name: "Lavender Mist", hex: "#E6E6FA", code: "SW-107" },
    { name: "Stormy Seas", hex: "#607D8B", code: "SW-108" }
  ],
  luxury: [
    { name: "Cashmere White", hex: "#F2EFE6", code: "SW-201" },
    { name: "Royal Navy", hex: "#2D3B55", code: "SW-202" },
    { name: "Emerald Forest", hex: "#1E5945", code: "SW-203" },
    { name: "Bordeaux", hex: "#5E2129", code: "SW-204" },
    { name: "Antique Gold", hex: "#B9975B", code: "SW-205" },
    { name: "Moonlight Silver", hex: "#C0C0C0", code: "SW-206" },
    { name: "Deep Amethyst", hex: "#6C4675", code: "SW-207" },
    { name: "Rich Walnut", hex: "#5D4037", code: "SW-208" }
  ]
};

// Room data
const roomData = [
  { id: 'room1', name: 'Living Room', image: 'livingroom.png' },
  { id: 'room2', name: 'Living Room 2', image: 'livingroom2.png' },
  { id: 'room3', name: 'Kitchen', image: 'kitchen.png' },
  { id: 'room4', name: 'Bed Room', image: 'bedroom.png' }
];

function PremiumWallColorVisualizer() {
  // States
  const [currentColor, setCurrentColor] = useState("#F8F8F8");
  const [currentColorDetails, setCurrentColorDetails] = useState({
    name: "Cloud White",
    code: "SW-001",
    type: "Standard"
  });
  const [recentColors, setRecentColors] = useState([]);
  const [activeTab, setActiveTab] = useState('standard');
  const [selectedRoom, setSelectedRoom] = useState('room1');
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  
  const wallRef = useRef(null);
  
  // Function to add a color to recent colors
  const addToRecentColors = (color, name, code, type) => {
    // Check if color already exists in recent colors
    const exists = recentColors.some(rc => rc.hex === color);
    if (!exists) {
      const updatedRecents = [
        { hex: color, name, code, type },
        ...recentColors.slice(0, 7) // Keep only the 8 most recent colors
      ];
      setRecentColors(updatedRecents);
    }
  };

  // Function to handle color selection
  const handleColorSelect = (color, name, code, type) => {
    setCurrentColor(color);
    setCurrentColorDetails({ name, code, type });
    addToRecentColors(color, name, code, type);
  };

  // Function to handle room selection
  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  // Function to handle brightness change
  const handleBrightnessChange = (event) => {
    setBrightness(event.target.value);
  };

  // Function to handle saturation change
  const handleSaturationChange = (event) => {
    setSaturation(event.target.value);
  };

  // Update the wall color when related states change
  useEffect(() => {
    if (wallRef.current) {
      // Apply color with brightness and saturation adjustments
      wallRef.current.style.backgroundColor = currentColor;
      wallRef.current.style.filter = `brightness(${brightness}%) saturate(${saturation}%)`;
    }
  }, [currentColor, brightness, saturation]);

  // Get current room image
  const getCurrentRoomImage = () => {
    const room = roomData.find(r => r.id === selectedRoom);
    return room ? room.image : roomData[0].image;
  };

  return (
    <div className="premium-visualizer-container">
      <div className="premium-visualizer-header">
        <h1 className="premium-visualizer-title">Premium Wall Color Visualizer</h1>
        <p className="premium-visualizer-subtitle">
          Transform your space with our <span className="highlight">professional-grade</span> color visualization tool
        </p>
      </div>

      <div className="premium-visualizer-content">
        <div className="premium-visualizer-main">
          {/* Room Selector */}
          <div className="room-selector">
            <label htmlFor="room-select">Choose a Room:</label>
            <select 
              id="room-select" 
              value={selectedRoom} 
              onChange={handleRoomChange}
              className="premium-select"
            >
              {roomData.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </div>

          {/* Visualizer Area */}
          <div className="visualizer-area">
            <div 
              className="wall-background" 
              ref={wallRef}
              style={{ 
                backgroundColor: currentColor,
                filter: `brightness(${brightness}%) saturate(${saturation}%)`
              }}
            ></div>
            <img 
              src={getCurrentRoomImage()} 
              alt="Room" 
              className="room-overlay" 
            />
          </div>

          {/* Current Color Info */}
          <div className="current-color-info">
            <div 
              className="current-color-swatch" 
              style={{ backgroundColor: currentColor }}
            ></div>
            <div className="current-color-details">
              <h3>{currentColorDetails.name}</h3>
              <p className="color-code">{currentColorDetails.code}</p>
              <p className="color-type">{currentColorDetails.type}</p>
            </div>
          </div>
        </div>

        <div className="premium-visualizer-sidebar">
          {/* Paint Type Tabs */}
          <div className="paint-type-tabs">
            <button 
              className={`tab-button ${activeTab === 'standard' ? 'active' : ''}`}
              onClick={() => setActiveTab('standard')}
            >
              Standard
            </button>
            <button 
              className={`tab-button ${activeTab === 'premium' ? 'active' : ''}`}
              onClick={() => setActiveTab('premium')}
            >
              Premium
            </button>
            <button 
              className={`tab-button ${activeTab === 'luxury' ? 'active' : ''}`}
              onClick={() => setActiveTab('luxury')}
            >
              Luxury
            </button>
            <button 
              className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent
            </button>
          </div>

          {/* Color Palette */}
          <div className="color-palette">
            {activeTab === 'recent' ? (
              <div className="color-grid">
                {recentColors.length > 0 ? (
                  recentColors.map((color, index) => (
                    <div 
                      key={`recent-${index}`} 
                      className="color-option"
                      onClick={() => handleColorSelect(color.hex, color.name, color.code, color.type)}
                    >
                      <div 
                        className="color-swatch" 
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <div className="color-info">
                        <span className="color-name">{color.name}</span>
                        <span className="color-code">{color.code}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-colors-message">No recent colors. Select colors to see them here.</p>
                )}
              </div>
            ) : (
              <div className="color-grid">
                {paintColors[activeTab].map((color, index) => (
                  <div 
                    key={`${activeTab}-${index}`} 
                    className="color-option"
                    onClick={() => handleColorSelect(color.hex, color.name, color.code, activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
                  >
                    <div 
                      className="color-swatch" 
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="color-info">
                      <span className="color-name">{color.name}</span>
                      <span className="color-code">{color.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="color-controls">
            <div className="control-group">
              <label htmlFor="brightness">
                Brightness: {brightness}%
              </label>
              <input
                type="range"
                id="brightness"
                min="50"
                max="150"
                value={brightness}
                onChange={handleBrightnessChange}
                className="premium-slider"
              />
            </div>
            
            <div className="control-group">
              <label htmlFor="saturation">
                Saturation: {saturation}%
              </label>
              <input
                type="range"
                id="saturation"
                min="50"
                max="150"
                value={saturation}
                onChange={handleSaturationChange}
                className="premium-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumWallColorVisualizer;