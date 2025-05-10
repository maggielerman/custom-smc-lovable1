
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Edit, Sliders } from "lucide-react";

const CustomizationOptions = () => {
  const navigate = useNavigate();
  
  const options = [
    {
      title: "Family Structure",
      description: "Choose the family structure that reflects your family composition",
      icon: <BookOpen className="h-12 w-12 text-book-red" />,
      examples: ["Two Parents (Mom & Dad)", "Single Mom", "Two Moms", "Two Dads", "Single Dad"]
    },
    {
      title: "Conception Journey",
      description: "Select the conception method that matches your family's experience",
      icon: <Sliders className="h-12 w-12 text-book-green" />,
      examples: ["IVF", "IUI", "Donor Egg", "Donor Sperm", "Donor Embryo"]
    },
    {
      title: "Personalize",
      description: "Add your child's name and choose age-appropriate content",
      icon: <Edit className="h-12 w-12 text-book-blue" />,
      examples: ["Child's Name", "Age Range", "Personalized Details"]
    }
  ];

  return (
    <section id="customize" className="py-16 md:py-24 bg-soft-purple/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Easy <span className="text-book-red">Customization</span> Options
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create a story that perfectly matches your family's journey in just a few simple steps.
            Here's what you can customize:
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {options.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="bg-gray-100 p-3 rounded-lg w-full">
                    <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
                    <ul className="text-sm text-gray-600">
                      {option.examples.map((example, idx) => (
                        <li key={idx} className="mb-1">• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="bg-book-red hover:bg-red-400 text-white text-lg py-6 px-10 rounded-full"
            onClick={() => navigate("/create")}
          >
            Start Creating Your Book
          </Button>
          <p className="mt-4 text-gray-600">
            Only $34.99 with free shipping on all orders
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomizationOptions;
