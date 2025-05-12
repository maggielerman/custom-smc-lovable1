
import React, { useRef, useEffect, useState } from 'react';
import { useColoring } from '@/context/ColoringContext';
import { Button } from '@/components/ui/button';
import { Download, FileImage } from 'lucide-react';
import { toast } from 'sonner';

interface ColoringCanvasProps {
  imageUrl: string;
}

const ColoringCanvas: React.FC<ColoringCanvasProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { activeColor, brushSize } = useColoring();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Load the base image when component mounts or image changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous'; // Important for downloading later
    img.src = imageUrl;

    img.onload = () => {
      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);
      setIsImageLoaded(true);
    };

    img.onerror = () => {
      toast.error("Failed to load image");
      setIsImageLoaded(false);
    };
  }, [imageUrl]);

  // Setup drawing handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isImageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      setIsDrawing(true);
      const { offsetX, offsetY } = getCoordinates(e, canvas);
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = getCoordinates(e, canvas);
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      ctx.closePath();
    };

    // Helper function to get coordinates for both mouse and touch events
    const getCoordinates = (e: MouseEvent | TouchEvent, element: HTMLCanvasElement) => {
      const rect = element.getBoundingClientRect();
      
      if ('touches' in e) {
        // Touch event
        const touch = e.touches[0];
        return {
          offsetX: touch.clientX - rect.left,
          offsetY: touch.clientY - rect.top
        };
      } else {
        // Mouse event
        return {
          offsetX: e.clientX - rect.left,
          offsetY: e.clientY - rect.top
        };
      }
    };

    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrawing(e);
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e);
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      stopDrawing();
    });

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      
      canvas.removeEventListener('touchstart', startDrawing as any);
      canvas.removeEventListener('touchmove', draw as any);
      canvas.removeEventListener('touchend', stopDrawing as any);
    };
  }, [isImageLoaded, activeColor, brushSize, isDrawing]);

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reload the original image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      toast.success("Canvas reset");
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Create download link
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'my-coloring-page.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully");
    } catch (error) {
      toast.error("Failed to download image");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
        <canvas 
          ref={canvasRef} 
          className="max-w-full h-auto"
          style={{ cursor: 'crosshair' }}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={handleReset}>
          <FileImage className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default ColoringCanvas;
