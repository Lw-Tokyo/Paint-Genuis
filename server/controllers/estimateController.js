exports.calculateEstimate = (req, res) => {
  try {
    const { length, width, height, paintType, coats } = req.body;

    if (!length || !width || !height || !coats) {
      return res.status(400).json({ error: "Length, width, height, and number of coats are required" });
    }

    const numericLength = parseFloat(length);
    const numericWidth = parseFloat(width);
    const numericHeight = parseFloat(height);
    const numericCoats = parseInt(coats);

    if (isNaN(numericLength) || isNaN(numericWidth) || isNaN(numericHeight) || isNaN(numericCoats)) {
      return res.status(400).json({ error: "All inputs must be valid numbers" });
    }

    const area = 2 * (numericLength * numericHeight + numericWidth * numericHeight) + (numericLength * numericWidth);

    let costPerSqFt;
    switch (paintType) {
      case "premium":
        costPerSqFt = 2.5;
        break;
      case "luxury":
        costPerSqFt = 3.5;
        break;
      default:
        costPerSqFt = 1.5;
    }

    const totalCost = area * costPerSqFt * numericCoats;

    res.json({ totalCost });
  } catch (err) {
    console.error("Error calculating estimate:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
