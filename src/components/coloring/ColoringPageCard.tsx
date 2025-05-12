
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColoringPageCardProps {
  imageUrl: string;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const ColoringPageCard: React.FC<ColoringPageCardProps> = ({
  imageUrl,
  title,
  isSelected = false,
  onClick,
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-lg",
        isSelected ? "ring-2 ring-book-red ring-offset-2" : ""
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full" 
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-center justify-center gap-2">
        <h3 className="font-medium text-center">{title}</h3>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ColoringPageCard;
