
import React from 'react';
import { useColoring } from '@/context/ColoringContext';

const ColorPalette: React.FC = () => {
  const { activeColor, setActiveColor, colors } = useColoring();

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg shadow-md">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-8 h-8 rounded-full transition-transform ${
            activeColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => setActiveColor(color)}
          aria-label={`Select ${color} color`}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
