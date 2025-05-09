exports.calculateEstimate = (req, res) => {
    const { length, width, height, paintType } = req.body;
  
    if (!length || !width || !height || !paintType) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    const wallArea = 2 * height * (length + width);
    
    // Dummy pricing based on type
    const paintPrices = {
      "affordable": 0.4,
      "mid-range": 0.6,
      "high-end": 1.0
    };
  
    const laborRate = 0.25;
  
    const paintCost = wallArea * (paintPrices[paintType] || 0.6);
    const laborCost = wallArea * laborRate;
    const totalCost = paintCost + laborCost;
  
    res.json({
      area: wallArea,
      paintCost: Math.round(paintCost),
      laborCost: Math.round(laborCost),
      totalCost: Math.round(totalCost)
    });
  };
  