
import React from 'react';
import { useColoring } from '@/context/ColoringContext';
import { Slider } from '@/components/ui/slider';

const BrushSize: React.FC = () => {
  const { brushSize, setBrushSize } = useColoring();

  const handleChange = (value: number[]) => {
    setBrushSize(value[0]);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Brush Size</label>
        <span className="text-sm">{brushSize}px</span>
      </div>
      <Slider
        value={[brushSize]}
        min={1}
        max={20}
        step={1}
        onValueChange={handleChange}
        className="cursor-pointer"
      />
    </div>
  );
};

export default BrushSize;
