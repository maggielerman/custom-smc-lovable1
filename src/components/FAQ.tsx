
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "At what age should I introduce this book to my child?",
      answer: "Child development experts recommend introducing the concept of donor conception as early as 3-4 years old, using age-appropriate language. Our books are designed with different versions for different age groups, so you can choose the one that best matches your child's developmental stage."
    },
    {
      question: "How customizable are the books?",
      answer: "Our books can be customized with your child's name, your family structure (single parent, same-sex parents, heterosexual parents), the specific type of assisted reproduction used (IVF, IUI, egg/sperm/embryo donation), and even physical characteristics to match your family."
    },
    {
      question: "Are the books medically accurate?",
      answer: "Yes, all our books are reviewed by fertility specialists to ensure they contain medically accurate information presented in an age-appropriate way. We strike a balance between scientific accuracy and child-friendly language."
    },
    {
      question: "How long does it take to receive my custom book?",
      answer: "After you complete your customization and place your order, it typically takes 5-7 business days for printing and 2-5 days for shipping within the United States. International shipping times may vary."
    },
    {
      question: "Can I see a digital proof before the book is printed?",
      answer: "Yes! We provide a complete digital preview of your customized book before finalizing your order, so you can make any necessary adjustments."
    },
    {
      question: "Do you offer books for families who used a surrogate?",
      answer: "Yes, we have specific book versions for families who used gestational carriers/surrogates, with appropriate language to explain this journey to children."
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked <span className="text-book-red">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our customizable donor conception books
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-lg font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 p-6 bg-soft-blue/20 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              We're here to help you create the perfect book for your family
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="mailto:support@littleoriginsbooks.com" 
                className="text-book-red hover:text-red-700 font-medium"
              >
                Email Us
              </a>
              <span className="text-gray-400">|</span>
              <a 
                href="tel:+18005551234" 
                className="text-book-red hover:text-red-700 font-medium"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
