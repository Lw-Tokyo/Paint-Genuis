import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// Add CSS styles directly in component
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  },
  subtitle: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#666'
  },
  highlight: {
    color: '#3b82f6',
    fontWeight: 'bold'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#333'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px'
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '20px'
  },
  canvas: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px'
  },
  loadingIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '250px',
    color: '#6b7280'
  },
  controlsContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    padding: '16px',
    marginBottom: '20px'
  },
  tabContainer: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '16px'
  },
  tab: {
    padding: '8px 16px',
    cursor: 'pointer',
    color: '#6b7280'
  },
  activeTab: {
    borderBottom: '2px solid #3b82f6',
    color: '#3b82f6'
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px'
  },
  colorSwatch: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer'
  },
  activeSwatch: {
    boxShadow: '0 0 0 2px #3b82f6'
  },
  colorSection: {
    marginBottom: '16px'
  },
  sectionLabel: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#333'
  },
  colorInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  colorInput: {
    width: '48px',
    height: '40px',
    padding: '0',
    border: '0'
  },
  textInput: {
    width: '120px',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  exportButton: {
    backgroundColor: '#10b981',
    color: 'white'
  },
  sliderContainer: {
    marginBottom: '16px'
  },
  slider: {
    width: '100%'
  },
  colorInfo: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  colorSample: {
    width: '48px',
    height: '48px',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
    marginRight: '12px'
  },
  colorInfoText: {
    fontSize: '14px',
    color: '#4b5563'
  },
  colorValue: {
    fontSize: '16px',
    fontWeight: '500'
  },
  recentColorsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  }
};

function AdvancedVisualizer() {
  const [currentColor, setCurrentColor] = useState("#D9E0E6"); // Default light blue-gray
  const [inputColor, setInputColor] = useState("#D9E0E6");
  const [recentColors, setRecentColors] = useState([]);
  const [activeTab, setActiveTab] = useState('palette');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [selectedRoom, setSelectedRoom] = useState('living-room'); // Default room id
  const canvasRef = useRef(null);
  const maskRef = useRef(null);
  const imageRef = useRef(null);
  
  // Predefined color palette - using useMemo to prevent recreation on each render
  const colorPalette = useMemo(() => [
    // Whites & Neutrals
    "#FFFFFF", "#F5F5F5", "#E8E8E8", "#D9D9D9", "#CCCCCC",
    // Blues
    "#D9E0E6", "#B8CFE5", "#8EB5D6", "#6A9AC7", "#4C7EAF",
    // Greens
    "#E6EFE9", "#C7E1D3", "#A4D1B8", "#7AC29C", "#549E7A",
    // Yellows
    "#FFF8E1", "#FFEDB8", "#FFE28A", "#FFD54F", "#FFC107",
    // Reds
    "#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350",
    // Purples
    "#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC",
    // Grays
    "#EDEFF1", "#C1C7CE", "#9AA2AB", "#6B737C", "#464C53"
  ], []);

  // Sample room options - using useMemo to prevent recreation on each render
  const roomOptions = useMemo(() => [
    { id: 'living-room', label: 'Living Room', image: 'living-room.jpg' },
    { id: 'bedroom', label: 'Bedroom', image: 'bedroom.jpg' },
    { id: 'kitchen', label: 'Kitchen', image: 'kitchen.jpg' },
    { id: 'bathroom', label: 'Bathroom', image: 'bathroom.jpg' },
  ], []);

  // Get current room image path
  const getCurrentRoomImage = useCallback(() => {
    const room = roomOptions.find(r => r.id === selectedRoom);
    return room ? room.image : 'living-room.jpg'; // Fallback to default if not found
  }, [selectedRoom, roomOptions]);

  // Get current room mask path - adjust mask naming convention as needed
  const getCurrentRoomMask = useCallback(() => {
    return `wall-mask.png`; // Using a single mask file for simplicity
  }, []);

  // Define renderVisualization with useCallback before it's used in any useEffect
  const renderVisualization = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !maskRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    
    // Draw the original room image
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    
    // Create a temporary canvas for the wall color
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Fill with selected color
    tempCtx.fillStyle = currentColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Apply brightness adjustment
    const brightnessFilter = `brightness(${brightness}%)`;
    tempCtx.filter = brightnessFilter;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.filter = 'none';
    
    // Apply the wall mask
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(maskRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
    
    // Overlay the colored wall onto the original image
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tempCanvas, 0, 0);
  }, [currentColor, brightness]);

  useEffect(() => {
    if (imageLoaded && canvasRef.current) {
      renderVisualization();
    }
  }, [currentColor, brightness, imageLoaded, renderVisualization]);

  // Load the room image and mask
  useEffect(() => {
    setImageLoaded(false);
    
    // Get image paths
    const imagePath = getCurrentRoomImage();
    const maskPath = getCurrentRoomMask();
    
    console.log(`Loading room image: ${imagePath}`);
    console.log(`Loading mask image: ${maskPath}`);
    
    // Load the room image
    const roomImage = new Image();
    roomImage.crossOrigin = "Anonymous";
    roomImage.src = imagePath;
    
    // Load the wall mask
    const maskImage = new Image();
    maskImage.crossOrigin = "Anonymous";
    maskImage.src = maskPath;
    
    // Handle image loading errors with more detailed logging
    roomImage.onerror = (e) => {
      console.error(`Error loading room image: ${imagePath}`);
      console.error('Error details:', e);
      // Try loading a test image to check if any images are loading
      const testImage = new Image();
      testImage.src = 'https://via.placeholder.com/400x300';
      testImage.onload = () => console.log('Test image loaded successfully');
      testImage.onerror = () => console.error('Even test image failed to load');
    };
    
    maskImage.onerror = (e) => {
      console.error(`Error loading mask image: ${maskPath}`);
      console.error('Error details:', e);
    };
    
    // Set up success handlers
    roomImage.onload = () => {
      console.log(`Room image loaded successfully: ${imagePath}`);
      imageRef.current = roomImage;
      if (maskRef.current) {
        setImageLoaded(true);
        renderVisualization();
      }
    };
    
    maskImage.onload = () => {
      console.log(`Mask image loaded successfully: ${maskPath}`);
      maskRef.current = maskImage;
      if (imageRef.current) {
        setImageLoaded(true);
        renderVisualization();
      }
    };
    
  }, [selectedRoom, getCurrentRoomImage, getCurrentRoomMask, renderVisualization]);

  const handleColorSwatchClick = (color) => {
    setCurrentColor(color);
    setInputColor(color);
    addToRecentColors(color);
  };

  const handleColorInputChange = (e) => {
    setInputColor(e.target.value);
  };

  const handleApplyColor = () => {
    setCurrentColor(inputColor);
    addToRecentColors(inputColor);
  };

  const addToRecentColors = (color) => {
    if (!recentColors.includes(color)) {
      const updatedRecents = [color, ...recentColors.slice(0, 4)];
      setRecentColors(updatedRecents);
    }
  };

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleExportImage = () => {
    if (!canvasRef.current) return;
    
    // Convert canvas to data URL
    const dataUrl = canvasRef.current.toDataURL('image/png');
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'visualized-room.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // For debugging - show loading status
  const getLoadingStatus = () => {
    if (!imageLoaded) {
      return `Loading ${getCurrentRoomImage()}...`;
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Wall Color Visualizer</h2>
      <p style={styles.subtitle}>
        See how different colors transform your space with our <span style={styles.highlight}>interactive</span> visualizer
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select a room:</label>
        <select 
          style={styles.select}
          value={selectedRoom}
          onChange={handleRoomChange}
        >
          {roomOptions.map(room => (
            <option key={room.id} value={room.id}>
              {room.label}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.imageContainer}>
        {/* Show raw image for debugging */}
        <div style={{marginBottom: '10px', display: imageLoaded ? 'none' : 'block'}}>
          <p>Debugging - Direct Image:</p>
          <img 
            src={getCurrentRoomImage()} 
            alt="Room" 
            style={{maxWidth: '100%', height: 'auto'}}
            onLoad={() => console.log("Direct image element loaded successfully")}
            onError={() => console.error("Direct image element failed to load")}
          />
        </div>
        
        <canvas
          ref={canvasRef}
          style={{
            ...styles.canvas,
            display: imageLoaded ? 'block' : 'none'
          }}
        />
        
        {!imageLoaded && (
          <div style={styles.loadingIndicator}>
            {getLoadingStatus()}
          </div>
        )}
      </div>

      <div style={styles.controlsContainer}>
        <div style={styles.tabContainer}>
          <div 
            style={activeTab === 'palette' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('palette')}
          >
            Color Palette
          </div>
          <div 
            style={activeTab === 'custom' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('custom')}
          >
            Custom Color
          </div>
          <div 
            style={activeTab === 'settings' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </div>
        </div>

        {activeTab === 'palette' && (
          <div>
            {recentColors.length > 0 && (
              <div style={styles.colorSection}>
                <p style={styles.sectionLabel}>Recent Colors</p>
                <div style={styles.recentColorsContainer}>
                  {recentColors.map((color, index) => (
                    <div 
                      key={`recent-${index}`}
                      style={{
                        ...styles.colorSwatch,
                        backgroundColor: color,
                        ...(currentColor === color ? styles.activeSwatch : {})
                      }}
                      onClick={() => handleColorSwatchClick(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <p style={styles.sectionLabel}>Color Palette</p>
            <div style={styles.colorGrid}>
              {colorPalette.map((color, index) => (
                <div 
                  key={`palette-${index}`}
                  style={{
                    ...styles.colorSwatch,
                    backgroundColor: color,
                    ...(currentColor === color ? styles.activeSwatch : {})
                  }}
                  onClick={() => handleColorSwatchClick(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'custom' && (
          <div>
            <label style={styles.sectionLabel}>Choose a custom color:</label>
            <div style={styles.colorInputContainer}>
              <input 
                type="color" 
                value={inputColor}
                onChange={handleColorInputChange}
                style={styles.colorInput}
              />
              <input 
                type="text" 
                value={inputColor}
                onChange={handleColorInputChange}
                style={styles.textInput}
                placeholder="#RRGGBB"
              />
              <button 
                style={{...styles.button, ...styles.applyButton}}
                onClick={handleApplyColor}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div style={styles.sliderContainer}>
              <label style={styles.sectionLabel}>
                Wall Brightness: {brightness}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={handleBrightnessChange}
                style={styles.slider}
              />
            </div>
            
            <button 
              style={{...styles.button, ...styles.exportButton}}
              onClick={handleExportImage}
            >
              Export Image
            </button>
          </div>
        )}
      </div>
      
      <div style={styles.colorInfo}>
        <div 
          style={{
            ...styles.colorSample,
            backgroundColor: currentColor
          }}
        />
        <div>
          <p style={styles.colorInfoText}>Current Wall Color</p>
          <p style={styles.colorValue}>{currentColor}</p>
        </div>
      </div>
    </div>
  );
}

export default AdvancedVisualizer;