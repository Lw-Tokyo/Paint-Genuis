import React, { useState, useRef, useEffect } from 'react';
import './WallColorVisualizer.css';

function WallMaskGenerator() {
  const [image, setImage] = useState(null);
  const [maskGenerated, setMaskGenerated] = useState(false);
  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [brushSize, setBrushSize] = useState(20);
  const [maskOpacity, setMaskOpacity] = useState(0.5);
  const [canvasReady, setCanvasReady] = useState(false);
  const [debug, setDebug] = useState(''); // For debugging

  // Initialize canvas refs as soon as component mounts
  useEffect(() => {
    setCanvasReady(true);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        // Wait until next render cycle to ensure canvas refs are defined
        setTimeout(() => {
          setupCanvas(img);
        }, 0);
        setMaskGenerated(false);
        setDebug('Image loaded: ' + img.width + 'x' + img.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const setupCanvas = (img) => {
    if (!canvasRef.current || !maskCanvasRef.current) {
      setDebug('Canvas references not available');
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image
    ctx.drawImage(img, 0, 0);
    
    // Reset mask canvas
    const maskCanvas = maskCanvasRef.current;
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    setDebug('Canvas setup complete: ' + canvas.width + 'x' + canvas.height);
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const draw = (e) => {
    if (!isDrawing.current || !maskCanvasRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const maskCanvas = maskCanvasRef.current;
    const maskCtx = maskCanvas.getContext('2d');
    
    // Calculate position with proper scaling
    const scaleX = maskCanvas.width / rect.width;
    const scaleY = maskCanvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Draw white on the mask (these areas will be colored)
    maskCtx.fillStyle = 'white';
    maskCtx.beginPath();
    maskCtx.arc(x, y, brushSize, 0, Math.PI * 2);
    maskCtx.fill();
    
    renderPreview();
    setDebug('Drawing at: ' + x.toFixed(0) + ',' + y.toFixed(0));
  };

  const renderPreview = () => {
    if (!canvasRef.current || !maskCanvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear and redraw original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    // Overlay mask with red tint for visibility
    const maskCanvas = maskCanvasRef.current;
    ctx.globalAlpha = maskOpacity;
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    
    // Create a temporary canvas to process the mask
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = maskCanvas.width;
    tempCanvas.height = maskCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw mask to temp canvas
    tempCtx.drawImage(maskCanvas, 0, 0);
    
    // Use the mask to create a colored overlay
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.globalAlpha = 1.0;
  };

  const handleBrushSizeChange = (e) => {
    setBrushSize(parseInt(e.target.value));
  };

  const handleOpacityChange = (e) => {
    setMaskOpacity(parseFloat(e.target.value));
    renderPreview();
  };

  const generateMask = () => {
    if (!maskCanvasRef.current) return;
    
    // Make sure the mask data is being preserved
    const maskCanvas = maskCanvasRef.current;
   // const maskData = maskCanvas.toDataURL('image/png');
    
    // Verify mask is not all black (check pixels)
    const maskCtx = maskCanvas.getContext('2d');
    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    let hasWhitePixels = false;
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) { // Check red channel (if > 0, not black)
        hasWhitePixels = true;
        break;
      }
    }
    
    if (!hasWhitePixels) {
      setDebug('WARNING: Mask appears to be all black. Did you paint any areas?');
    } else {
      setDebug('Mask generated successfully with painted areas.');
    }
    
    setMaskGenerated(true);
  };

  const downloadMask = () => {
    if (!maskGenerated || !maskCanvasRef.current) return;
    
    const maskCanvas = maskCanvasRef.current;
    const dataURL = maskCanvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'wall-mask.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setDebug('Mask downloaded');
  };

  const clearMask = () => {
    if (!maskCanvasRef.current || !canvasRef.current || !image) return;
    
    const maskCanvas = maskCanvasRef.current;
    const maskCtx = maskCanvas.getContext('2d');
    
    // Reset to all black
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    // Reset main canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    setMaskGenerated(false);
    setDebug('Mask cleared');
  };

  // For debugging - shows the actual mask
  const toggleMaskPreview = () => {
    if (!canvasRef.current || !maskCanvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const maskCanvas = maskCanvasRef.current;
    
    // Toggle between showing the image and showing the mask
    const showingMask = debug.includes("Showing mask");
    
    if (showingMask) {
      // Show original image with overlay
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      
      ctx.globalAlpha = maskOpacity;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.globalAlpha = 1.0;
      
      setDebug('Showing image with overlay');
    } else {
      // Show just the mask
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(maskCanvas, 0, 0);
      setDebug('Showing mask preview');
    }
  };

  return (
    <div className="mask-generator-container">
      <h2 className="visualizer-title">Wall Mask Generator</h2>
      <p className="visualizer-subtitle">Create masks for the Wall Color Visualizer</p>
      
      <div className="upload-section">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="file-input"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="file-input-label">
          Choose Room Image
        </label>
      </div>
      
      {debug && (
        <div className="debug-info" style={{margin: '10px 0', padding: '5px', background: '#f0f0f0', borderRadius: '4px'}}>
          <small>{debug}</small>
        </div>
      )}
      
      {image && (
        <div className="editor-container">
          <div className="canvas-container">
            {/* Main canvas to display image with mask overlay */}
            <canvas 
              ref={canvasRef}
              className="editor-canvas"
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid #ccc',
                display: 'block'
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            
            {/* Hidden canvas for storing the mask */}
            <canvas 
              ref={maskCanvasRef}
              className="mask-canvas"
              style={{ 
                display: 'none'
              }}
            />
          </div>
          
          <div className="controls-panel">
            <div className="control-group">
              <label className="control-label">
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={handleBrushSizeChange}
                className="slider"
              />
            </div>
            
            <div className="control-group">
              <label className="control-label">
                Overlay Opacity: {maskOpacity.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.1"
                value={maskOpacity}
                onChange={handleOpacityChange}
                className="slider"
              />
            </div>
            
            <div className="button-group">
              <button 
                className="action-button"
                onClick={clearMask}
              >
                Clear Mask
              </button>
              
              <button 
                className="action-button"
                onClick={toggleMaskPreview}
              >
                Toggle Preview
              </button>
              
              <button 
                className="action-button primary"
                onClick={generateMask}
              >
                Generate Mask
              </button>
              
              {maskGenerated && (
                <button 
                  className="action-button success"
                  onClick={downloadMask}
                >
                  Download Mask
                </button>
              )}
            </div>
            
            <div className="instructions">
              <h4>Instructions:</h4>
              <ol>
                <li>Upload a room image</li>
                <li>Paint over the walls with the brush (the red areas show what will be colored)</li>
                <li>Adjust brush size as needed</li>
                <li>Generate and download the mask</li>
                <li>Use the mask with the Wall Color Visualizer</li>
              </ol>
              <p className="note" style={{color: '#e74c3c'}}>
                <strong>Important:</strong> The areas you paint (red overlay) will be the walls that 
                change color in the visualizer.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!image && canvasReady && (
        <div className="empty-state" style={{
          padding: '30px', 
          textAlign: 'center', 
          background: '#f5f5f5',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p>Please upload a room image to get started</p>
        </div>
      )}
    </div>
  );
}

export default WallMaskGenerator;