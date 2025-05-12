
import React, { createContext, useContext, useState } from 'react';

type Color = string;

interface ColoringContextType {
  activeColor: Color;
  setActiveColor: (color: Color) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  colors: Color[];
}

const defaultColors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
  '#800080', '#008000', '#800000', '#008080',
];

const ColoringContext = createContext<ColoringContextType | undefined>(undefined);

export const ColoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeColor, setActiveColor] = useState<Color>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [colors] = useState<Color[]>(defaultColors);

  return (
    <ColoringContext.Provider value={{
      activeColor,
      setActiveColor,
      brushSize,
      setBrushSize,
      colors,
    }}>
      {children}
    </ColoringContext.Provider>
  );
};

export const useColoring = (): ColoringContextType => {
  const context = useContext(ColoringContext);
  if (context === undefined) {
    throw new Error('useColoring must be used within a ColoringProvider');
  }
  return context;
};
