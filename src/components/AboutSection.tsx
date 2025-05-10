
import { CheckCircle } from "lucide-react";

const AboutSection: React.FC = () => {
  const benefits = [
    {
      title: "Age-appropriate language",
      description: "Stories crafted with developmentally appropriate language for different age groups"
    },
    {
      title: "Scientifically accurate",
      description: "Medically reviewed content that explains conception in a factual but child-friendly way"
    },
    {
      title: "Inclusive representation",
      description: "Diverse family structures and journeys represented with care and authenticity"
    },
    {
      title: "Beautiful illustrations",
      description: "Engaging, colorful artwork that helps children connect with their unique story"
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why These Books <span className="text-book-red">Matter</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Children conceived through assisted reproduction deserve to understand their unique origin story 
              in a way that celebrates the love and intention that brought them into the world.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our customizable books are designed by experts in child development and reproductive medicine 
              to help parents navigate these important conversations with confidence and joy.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-book-green mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-soft-blue rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gentle-pink rounded-full z-0"></div>
              
              <div className="relative z-10 bg-white rounded-lg p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-book-red mb-4 text-center">Our Mission</h3>
                <p className="text-gray-600 mb-6 text-center">
                  We believe every child deserves to know their story in a way that builds confidence, 
                  security, and a strong sense of identity.
                </p>
                
                <div className="p-4 bg-soft-purple/20 rounded-lg mb-6">
                  <p className="italic text-gray-700">
                    "Research shows that children who learn about their donor conception early 
                    in life through age-appropriate stories have better psychological outcomes 
                    and stronger family relationships."
                  </p>
                </div>
                
                <p className="text-gray-600">
                  Our team includes fertility specialists, child psychologists, and parents through 
                  donor conception who understand the unique challenges and joys of these family journeys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
