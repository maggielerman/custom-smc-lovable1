
import { Button } from "@/components/ui/button";
import { useBookContext } from "@/context/BookContext";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const { openPreview } = useBookContext();
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-b from-white to-soft-blue/10 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800">
            Every Child's Story <span className="text-book-red">Deserves</span> to be Told
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Customizable children's books that explain donor conception with love, 
            care, and age-appropriate language.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-book-red hover:bg-red-400 text-white text-lg py-6 px-8 rounded-full"
              onClick={() => navigate("/create")}
            >
              Create Your Book
            </Button>
            <Button 
              variant="outline"
              className="border-book-red text-book-red hover:bg-book-red/10 text-lg py-6 px-8 rounded-full"
              onClick={openPreview}
            >
              See Example
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 relative">
          <div className="relative w-full max-w-md mx-auto">
            <div className="book-cover bg-gradient-to-br from-book-red to-soft-blue rounded-lg book-shadow aspect-[3/4] p-1 transform rotate-3">
              <div className="h-full w-full bg-white rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="font-bold text-2xl text-book-red mb-2">My Special Story</h2>
                  <div className="w-32 h-32 mx-auto bg-soft-blue rounded-full mb-2 flex items-center justify-center">
                    <span className="text-5xl">👨‍👩‍👧</span>
                  </div>
                  <p className="text-sm text-gray-500">A personalized journey of how you came to be</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-calm-yellow rounded-full flex items-center justify-center animate-float z-10">
              <span className="font-bold text-gray-800 text-center">100% Customizable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
