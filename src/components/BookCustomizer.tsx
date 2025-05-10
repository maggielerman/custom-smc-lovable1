
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ConceptionType = 'iui' | 'ivf' | 'donor-egg' | 'donor-sperm' | 'donor-embryo';
type FamilyStructure = 'hetero-couple' | 'single-mom' | 'single-dad' | 'two-moms' | 'two-dads';

const BookCustomizer: React.FC = () => {
  const [conceptionType, setConceptionType] = useState<ConceptionType>('ivf');
  const [familyStructure, setFamilyStructure] = useState<FamilyStructure>('hetero-couple');
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("3-5");
  
  return (
    <section id="customize" className="py-16 md:py-24 bg-soft-purple/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Create Your <span className="text-book-red">Personalized</span> Book
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Customize a story that perfectly matches your family's journey, making it easier to
            share your child's unique beginning with them.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="story" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="story">Story Options</TabsTrigger>
              <TabsTrigger value="details">Family Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="story" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Story Type</CardTitle>
                  <CardDescription>
                    Select the conception journey that matches your family's experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="conception">Conception Type</Label>
                      <Select 
                        value={conceptionType} 
                        onValueChange={(value) => setConceptionType(value as ConceptionType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select conception type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ivf">IVF</SelectItem>
                          <SelectItem value="iui">IUI</SelectItem>
                          <SelectItem value="donor-sperm">Donor Sperm</SelectItem>
                          <SelectItem value="donor-egg">Donor Egg</SelectItem>
                          <SelectItem value="donor-embryo">Donor Embryo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age Range</Label>
                      <Select 
                        value={childAge}
                        onValueChange={setChildAge}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2-4">Toddler (2-4 years)</SelectItem>
                          <SelectItem value="5-7">Young Child (5-7 years)</SelectItem>
                          <SelectItem value="8-10">Older Child (8-10 years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Family Details</CardTitle>
                  <CardDescription>
                    Tell us about your family structure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="family">Family Structure</Label>
                      <Select 
                        value={familyStructure} 
                        onValueChange={(value) => setFamilyStructure(value as FamilyStructure)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select family structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hetero-couple">Two Parents (Mom & Dad)</SelectItem>
                          <SelectItem value="single-mom">Single Mom</SelectItem>
                          <SelectItem value="single-dad">Single Dad</SelectItem>
                          <SelectItem value="two-moms">Two Moms</SelectItem>
                          <SelectItem value="two-dads">Two Dads</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Child's Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter child's name" 
                        value={childName} 
                        onChange={(e) => setChildName(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-4">
                  <Button className="bg-book-green hover:bg-green-400 text-white w-full md:w-auto">
                    Preview Your Book
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center">
            <div className="mb-6 p-4 bg-calm-yellow/30 rounded-lg inline-block">
              <p className="text-gray-700 font-medium">
                Price: <span className="font-bold">$34.99</span>
                <span className="text-sm ml-2 text-gray-500">Free shipping on all orders</span>
              </p>
            </div>
            <Button 
              className="bg-book-red hover:bg-red-400 text-white text-lg py-6 px-10 rounded-full"
            >
              Create Your Custom Book
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookCustomizer;
