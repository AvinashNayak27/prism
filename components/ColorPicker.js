"use client"; 
import { useState, useRef, useEffect } from "react";

export default function ColorPicker({ 
  selectedColors = [], 
  onColorsChange, 
  maxColors = 5,
  showRandomGenerator = true 
}) {
  const [customColor, setCustomColor] = useState('#ff0000');
  const colorInputRef = useRef(null);

  useEffect(() => {
    if (selectedColors.length === 0) {
      console.log('selectedColors', selectedColors);
      console.log('maxColors', maxColors);
    }
  }, [selectedColors]);
  const generateNFTColors = async () => {
    try {
      const response = await fetch("https://base-mainnet.g.alchemy.com/nft/v3/RJ-Ir6dl4t5uuC2nAy9ET/getNFTsForContract?contractAddress=0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB&withMetadata=true&limit=100", {
        method: "GET",
        headers: {},
      });

      const body = await response.json();
      console.log(body);
      
      if (body.nfts && Array.isArray(body.nfts)) {
        const validColors = [];
        const validHexPattern = /^#[0-9A-Fa-f]{6}$/;
        
        // First collect all valid colors
        for (const nft of body.nfts) {
          if (nft.name) {
            let potentialColor = nft.name;
            
            // If name doesn't start with #, add it
            if (!potentialColor.startsWith('#')) {
              potentialColor = '#' + potentialColor;
            }
            
            // Validate if it's a proper hex color
            if (validHexPattern.test(potentialColor)) {
              validColors.push(potentialColor);
            }
          }
        }

        // Randomly select colors from valid colors
        const colors = [];
        while (colors.length < Math.min(maxColors, 5) && validColors.length > 0) {
          const randomIndex = Math.floor(Math.random() * validColors.length);
          colors.push(validColors[randomIndex]);
          validColors.splice(randomIndex, 1);
        }
        
        // If we didn't get enough valid colors, fill with fallback colors
        while (colors.length < Math.min(maxColors, 5)) {
          colors.push('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
        }
        
        onColorsChange(colors);
      } else {
        // Fallback to random colors if API fails
        generateFallbackColors();
      }
    } catch (error) {
      console.error('Error fetching NFT colors:', error);
      // Fallback to random colors if API fails
      generateFallbackColors();
    }
  };

  const generateFallbackColors = () => {
    const colors = [];
    const count = maxColors;
    for (let i = 0; i < Math.min(count, maxColors); i++) {
      colors.push('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
    }
    onColorsChange(colors);
  };

  const addCustomColor = () => {
    if (isValidHexColor(customColor) && !selectedColors.includes(customColor) && selectedColors.length < maxColors) {
      onColorsChange([...selectedColors, customColor]);
    }
  };

  const removeColor = (colorToRemove) => {
    onColorsChange(selectedColors.filter(color => color !== colorToRemove));
  };

  const isValidHexColor = (hex) => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  const handleColorInputChange = (e) => {
    const value = e.target.value;
    setCustomColor(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addCustomColor();
    }
  };


  return (
    <div className="space-y-6">
      {/* Random Generator */}
      {showRandomGenerator && (
        <div>
          <button
            onClick={generateNFTColors}
            className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white px-6 py-3 rounded-full font-semibold font-dotted transition-all button-shadow"
          >
            🎨 Generate NFT Colors
          </button>
        </div>
      )}

      {/* Custom Color Input */}
      <div>
        <label className="block text-slate-300 text-sm font-medium font-dotted mb-3">
          Add Custom Color
        </label>
        <div className="flex space-x-2">
          <input
            ref={colorInputRef}
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-12 h-10 rounded-lg border-2 border-slate-600/30 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={handleColorInputChange}
            onKeyPress={handleKeyPress}
            placeholder="#ff0000"
            className="flex-1 glass-dark border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
          <button
            onClick={addCustomColor}
            disabled={!isValidHexColor(customColor) || selectedColors.includes(customColor) || selectedColors.length >= maxColors}
            className="glass-dark hover:bg-slate-700/50 disabled:bg-slate-800/30 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors button-shadow"
          >
            Add
          </button>
        </div>
        {!isValidHexColor(customColor) && customColor.length > 0 && (
          <p className="text-red-300 text-xs mt-1 font-dotted">Please enter a valid hex color (e.g., #ff0000)</p>
        )}
      </div>

      {/* Selected Colors */}
      <div>
        <label className="block text-slate-300 text-sm font-medium font-dotted mb-3">
          Selected Colors ({selectedColors.length} / {maxColors})
        </label>
        {selectedColors.length === 0 ? (
          <div className="text-slate-400 text-center py-8 border-2 border-dashed border-slate-600/30 rounded-lg glass-dark">
            No colors selected yet
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-3">
            {selectedColors.map((color, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div
                  className="w-16 h-16 rounded-lg border-2 border-slate-600/30 cursor-pointer group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <button
                  onClick={() => removeColor(color)}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 button-shadow"
                >
                  ×
                </button>
                <p className="text-xs text-slate-400 text-center mt-1 font-mono">
                  {color}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
