
import React from 'react';
import { cn } from "@/lib/utils";

export interface BookPage {
  title: string;
  content: string;
  color: string;
  emoji?: string;
}

interface BookPageContentProps {
  page: BookPage;
}

const BookPageContent: React.FC<BookPageContentProps> = ({ page }) => {
  return (
    <div className={cn("aspect-[4/3] flex flex-col items-center justify-center p-8 rounded-lg relative overflow-hidden", page.color)}>
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center z-10">
        {page.title}
      </h3>
      
      <div className="book-page bg-white rounded-lg p-6 w-full md:w-4/5 mx-auto z-10 shadow-lg">
        <p className="text-gray-700 text-lg text-center">
          {page.content}
        </p>
        
        <div className="mt-6 flex justify-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="text-4xl">
              {page.emoji || "📚"}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute bottom-4 right-4 text-6xl">{page.emoji || "📚"}</div>
      </div>
    </div>
  );
};

export default BookPageContent;
