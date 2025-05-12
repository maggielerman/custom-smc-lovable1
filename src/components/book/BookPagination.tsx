
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookPage } from './BookPageContent';

interface BookPaginationProps {
  pages: BookPage[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const BookPagination: React.FC<BookPaginationProps> = ({ pages, currentPage, setCurrentPage }) => {
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pages.length);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length);
  };
  
  return (
    <div className="flex justify-between items-center mt-6 px-4">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={prevPage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex space-x-2">
        {pages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              currentPage === index ? "bg-book-red" : "bg-gray-300"
            )}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={nextPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BookPagination;
