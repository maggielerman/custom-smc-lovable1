import { useState } from "react";
import { useBookContext } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Check, Family, Baby, Egg, Dna, Users } from "lucide-react";

// Define step types
type StepType = "family-structure" | "conception-type" | "donor-options" | "surrogacy" | "child-details" | "review";

const BookCustomizer: React.FC = () => {
  const { 
    conceptionType, 
    setConceptionType, 
    familyStructure, 
    setFamilyStructure,
    childName,
    setChildName,
    childAge,
    setChildAge,
    openPreview
  } = useBookContext();
  
  // Add state for the current step
  const [currentStep, setCurrentStep] = useState<StepType>("family-structure");
  
  // Add state for donor and surrogacy options
  const [usedDonorEgg, setUsedDonorEgg] = useState(false);
  const [usedDonorSperm, setUsedDonorSperm] = useState(false);
  const [usedDonorEmbryo, setUsedDonorEmbryo] = useState(false);
  const [usedSurrogate, setUsedSurrogate] = useState(false);
  
  const handlePreviewClick = () => {
    if (!childName.trim()) {
      toast.warning("Please enter your child's name for a personalized preview");
      return;
    }
    openPreview();
  };

  const handleCreateBookClick = () => {
    if (!childName.trim()) {
      toast.warning("Please enter your child's name to create your book");
      return;
    }
    toast.success("Your book has been added to cart!");
  };
  
  // Function to navigate to next step
  const nextStep = () => {
    switch (currentStep) {
      case "family-structure":
        setCurrentStep("conception-type");
        break;
      case "conception-type":
        setCurrentStep("donor-options");
        break;
      case "donor-options":
        if (usedDonorEgg || usedDonorSperm || usedDonorEmbryo) {
          setCurrentStep("surrogacy");
        } else {
          setCurrentStep("child-details");
        }
        break;
      case "surrogacy":
        setCurrentStep("child-details");
        break;
      case "child-details":
        setCurrentStep("review");
        break;
      default:
        break;
    }
  };
  
  // Function to navigate to previous step
  const prevStep = () => {
    switch (currentStep) {
      case "conception-type":
        setCurrentStep("family-structure");
        break;
      case "donor-options":
        setCurrentStep("conception-type");
        break;
      case "surrogacy":
        setCurrentStep("donor-options");
        break;
      case "child-details":
        if (usedDonorEgg || usedDonorSperm || usedDonorEmbryo) {
          setCurrentStep(usedSurrogate ? "surrogacy" : "donor-options");
        } else {
          setCurrentStep("conception-type");
        }
        break;
      case "review":
        setCurrentStep("child-details");
        break;
      default:
        break;
    }
  };
  
  // Check if current step is the first
  const isFirstStep = currentStep === "family-structure";
  // Check if current step is the last
  const isLastStep = currentStep === "review";
  
  // Helper function to get step number
  const getStepNumber = (step: StepType): number => {
    const steps: StepType[] = ["family-structure", "conception-type", "donor-options", "surrogacy", "child-details", "review"];
    return steps.indexOf(step) + 1;
  };
  
  return (
    <section id="customize" className="py-16 md:py-24 bg-soft-purple/10 rounded-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Create Your <span className="text-book-red">Personalized</span> Book
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Customize a story that perfectly matches your family's journey, making it easier to
            share your child's unique beginning with them.
          </p>
          
          {/* Progress bar */}
          <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-book-red">Step {getStepNumber(currentStep)} of 6</span>
              <span className="text-sm font-medium text-gray-500">{Math.floor((getStepNumber(currentStep) / 6) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-book-red" 
                style={{ width: `${(getStepNumber(currentStep) / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            {/* Step 1: Family Structure */}
            {currentStep === "family-structure" && (
              <>
                <CardHeader className="bg-gradient-to-r from-soft-blue/20 to-calm-yellow/20 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-book-red text-white flex items-center justify-center">
                      <Users size={20} />
                    </div>
                    <div>
                      <CardTitle>Family Structure</CardTitle>
                      <CardDescription>Tell us about your family composition</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="family-structure" className="text-base font-medium mb-3 block">
                        Select your family structure:
                      </Label>
                      <RadioGroup
                        value={familyStructure}
                        onValueChange={(value) => setFamilyStructure(value as any)}
                        className="grid gap-4 md:grid-cols-2"
                      >
                        <Label
                          htmlFor="hetero-couple"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👨‍👩‍👧</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Two Parents (Mom & Dad)</p>
                              <p className="text-sm text-muted-foreground">Traditional family structure</p>
                            </div>
                          </div>
                          <RadioGroupItem value="hetero-couple" id="hetero-couple" />
                        </Label>

                        <Label
                          htmlFor="single-mom"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👩‍👧</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Single Mom</p>
                              <p className="text-sm text-muted-foreground">Solo parent journey</p>
                            </div>
                          </div>
                          <RadioGroupItem value="single-mom" id="single-mom" />
                        </Label>

                        <Label
                          htmlFor="single-dad"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👨‍👧</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Single Dad</p>
                              <p className="text-sm text-muted-foreground">Solo parent journey</p>
                            </div>
                          </div>
                          <RadioGroupItem value="single-dad" id="single-dad" />
                        </Label>

                        <Label
                          htmlFor="two-moms"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👩‍👩‍👧</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Two Moms</p>
                              <p className="text-sm text-muted-foreground">Same-sex female parents</p>
                            </div>
                          </div>
                          <RadioGroupItem value="two-moms" id="two-moms" />
                        </Label>

                        <Label
                          htmlFor="two-dads"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👨‍👨‍👧</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Two Dads</p>
                              <p className="text-sm text-muted-foreground">Same-sex male parents</p>
                            </div>
                          </div>
                          <RadioGroupItem value="two-dads" id="two-dads" />
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
            
            {/* Step 2: Conception Type */}
            {currentStep === "conception-type" && (
              <>
                <CardHeader className="bg-gradient-to-r from-gentle-pink/20 to-soft-blue/20 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-book-red text-white flex items-center justify-center">
                      <Dna size={20} />
                    </div>
                    <div>
                      <CardTitle>Conception Journey</CardTitle>
                      <CardDescription>Select how your child was conceived</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="conception-type" className="text-base font-medium mb-3 block">
                        Select your conception method:
                      </Label>
                      <RadioGroup
                        value={conceptionType}
                        onValueChange={(value) => setConceptionType(value as any)}
                        className="grid gap-4"
                      >
                        <Label
                          htmlFor="ivf"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">🔬</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">In Vitro Fertilization (IVF)</p>
                              <p className="text-sm text-muted-foreground">Egg and sperm combined in a laboratory</p>
                            </div>
                          </div>
                          <RadioGroupItem value="ivf" id="ivf" />
                        </Label>

                        <Label
                          htmlFor="iui"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">💉</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Intrauterine Insemination (IUI)</p>
                              <p className="text-sm text-muted-foreground">Sperm placed directly in the uterus</p>
                            </div>
                          </div>
                          <RadioGroupItem value="iui" id="iui" />
                        </Label>

                        <Label
                          htmlFor="donor-egg"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">🥚</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Donor Egg</p>
                              <p className="text-sm text-muted-foreground">Using donated eggs</p>
                            </div>
                          </div>
                          <RadioGroupItem value="donor-egg" id="donor-egg" />
                        </Label>

                        <Label
                          htmlFor="donor-sperm"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">🌱</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Donor Sperm</p>
                              <p className="text-sm text-muted-foreground">Using donated sperm</p>
                            </div>
                          </div>
                          <RadioGroupItem value="donor-sperm" id="donor-sperm" />
                        </Label>

                        <Label
                          htmlFor="donor-embryo"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">✨</div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Donor Embryo</p>
                              <p className="text-sm text-muted-foreground">Using a donated embryo</p>
                            </div>
                          </div>
                          <RadioGroupItem value="donor-embryo" id="donor-embryo" />
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
            
            {/* Step 3: Donor Options */}
            {currentStep === "donor-options" && (
              <>
                <CardHeader className="bg-gradient-to-r from-calm-yellow/20 to-gentle-pink/20 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-book-red text-white flex items-center justify-center">
                      <Egg size={20} />
                    </div>
                    <div>
                      <CardTitle>Donor Details</CardTitle>
                      <CardDescription>Tell us more about your donor journey</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      Select all that apply to your family's journey:
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="donor-egg-option" 
                          checked={usedDonorEgg} 
                          onCheckedChange={() => setUsedDonorEgg(!usedDonorEgg)}
                        />
                        <label
                          htmlFor="donor-egg-option"
                          className="flex items-center gap-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="text-xl">🥚</div>
                          Used donor eggs in our journey
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="donor-sperm-option" 
                          checked={usedDonorSperm} 
                          onCheckedChange={() => setUsedDonorSperm(!usedDonorSperm)}
                        />
                        <label
                          htmlFor="donor-sperm-option"
                          className="flex items-center gap-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="text-xl">🌱</div>
                          Used donor sperm in our journey
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="donor-embryo-option" 
                          checked={usedDonorEmbryo} 
                          onCheckedChange={() => setUsedDonorEmbryo(!usedDonorEmbryo)}
                        />
                        <label
                          htmlFor="donor-embryo-option"
                          className="flex items-center gap-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="text-xl">✨</div>
                          Used donor embryo
                        </label>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-md mt-4">
                      <p className="text-sm text-muted-foreground">
                        Your selections help us tailor the story to explain your child's conception journey
                        in an age-appropriate way. We'll adjust the language and details based on your choices.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
            
            {/* Step 4: Surrogacy */}
            {currentStep === "surrogacy" && (
              <>
                <CardHeader className="bg-gradient-to-r from-soft-purple/20 to-calm-yellow/20 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-book-red text-white flex items-center justify-center">
                      <Baby size={20} />
                    </div>
                    <div>
                      <CardTitle>Surrogacy</CardTitle>
                      <CardDescription>Tell us about your surrogacy journey</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="surrogacy-option" className="text-base font-medium mb-3 block">
                        Did your family use a surrogate?
                      </Label>
                      <RadioGroup
                        value={usedSurrogate ? "yes" : "no"}
                        onValueChange={(value) => setUsedSurrogate(value === "yes")}
                        className="grid gap-4 md:grid-cols-2"
                      >
                        <Label
                          htmlFor="surrogacy-yes"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">Yes</p>
                              <p className="text-sm text-muted-foreground">We used a surrogate</p>
                            </div>
                          </div>
                          <RadioGroupItem value="yes" id="surrogacy-yes" />
                        </Label>

                        <Label
                          htmlFor="surrogacy-no"
                          className="flex items-center justify-between space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">No</p>
                              <p className="text-sm text-muted-foreground">We did not use a surrogate</p>
                            </div>
                          </div>
                          <RadioGroupItem value="no" id="surrogacy-no" />
                        </Label>
                      </RadioGroup>
                    </div>
                    
                    {usedSurrogate && (
                      <div className="mt-6 p-4 bg-muted/30 rounded-md">
                        <p className="text-sm">
                          We'll include age-appropriate language to explain how a surrogate helped
                          bring your child into the world, focusing on the love and care involved
                          in your family's journey.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </>
            )}
            
            {/* Step 5: Child Details */}
            {currentStep === "child-details" && (
              <>
                <CardHeader className="bg-gradient-to-r from-book-red/10 to-soft-blue/20 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-book-red text-white flex items-center justify-center">
                      <Baby size={20} />
                    </div>
                    <div>
                      <CardTitle>Child's Details</CardTitle>
                      <CardDescription>Personalize the story for your child</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="child-name">Child's Name</Label>
                        <Input
                          id="child-name"
                          placeholder="Enter your child's name"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          This will be used throughout the story
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="child-age">Child's Age Group</Label>
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
                        <p className="text-xs text-muted-foreground">
                          We'll adjust the language to be age-appropriate
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
            
            {/* Step 6: Review */}
            {currentStep === "review" && (
              <>
                <CardHeader className="bg-gradient-to-r from-book-green/20 to-calm-yellow/20 rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-book-green text-white flex items-center justify-center">
                      <Check size={20} />
                    </div>
                    <div>
                      <CardTitle>Review Your Book</CardTitle>
                      <CardDescription>Check your customizations before ordering</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="bg-muted/30 p-4 rounded-md">
                          <h3 className="font-medium text-sm mb-2">Family Details</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Family Structure:</span>
                              <span className="font-medium">{familyStructure === "hetero-couple" ? "Two Parents (Mom & Dad)" : 
                                familyStructure === "single-mom" ? "Single Mom" : 
                                familyStructure === "single-dad" ? "Single Dad" : 
                                familyStructure === "two-moms" ? "Two Moms" : 
                                "Two Dads"}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Child's Name:</span>
                              <span className="font-medium">{childName || "-"}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Age Group:</span>
                              <span className="font-medium">
                                {childAge === "2-4" ? "Toddler (2-4 years)" : 
                                 childAge === "5-7" ? "Young Child (5-7 years)" : 
                                 "Older Child (8-10 years)"}
                              </span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-md">
                          <h3 className="font-medium text-sm mb-2">Conception Journey</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Conception Type:</span>
                              <span className="font-medium">
                                {conceptionType === "ivf" ? "IVF" : 
                                 conceptionType === "iui" ? "IUI" : 
                                 conceptionType === "donor-egg" ? "Donor Egg" : 
                                 conceptionType === "donor-sperm" ? "Donor Sperm" : 
                                 "Donor Embryo"}
                              </span>
                            </li>
                            {(usedDonorEgg || usedDonorSperm || usedDonorEmbryo) && (
                              <li className="flex justify-between">
                                <span className="text-muted-foreground">Donor Options:</span>
                                <span className="font-medium">
                                  {[
                                    usedDonorEgg ? "Donor Egg" : null,
                                    usedDonorSperm ? "Donor Sperm" : null,
                                    usedDonorEmbryo ? "Donor Embryo" : null
                                  ].filter(Boolean).join(", ")}
                                </span>
                              </li>
                            )}
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Surrogacy:</span>
                              <span className="font-medium">{usedSurrogate ? "Yes" : "No"}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-book-red/10 to-soft-blue/10 p-5 rounded-xl">
                        <div className="text-center mb-4">
                          <h3 className="font-bold text-xl">{childName ? `${childName}'s` : "Your"} Special Story</h3>
                          <p className="text-sm text-gray-600">A personalized journey of how you came to be</p>
                        </div>
                        
                        <div className="aspect-square max-w-[180px] mx-auto bg-white rounded-lg shadow-lg p-4 flex items-center justify-center mb-4">
                          <div className="text-6xl">
                            {familyStructure === "hetero-couple" ? "👨‍👩‍👧" : 
                             familyStructure === "single-mom" ? "👩‍👧" : 
                             familyStructure === "single-dad" ? "👨‍👧" : 
                             familyStructure === "two-moms" ? "👩‍👩‍👧" : 
                             "👨‍👨‍👧"}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <Button 
                            variant="outline" 
                            className="border-book-red text-book-red hover:bg-book-red/10 mb-2"
                            onClick={handlePreviewClick}
                          >
                            Preview Book
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-calm-yellow/20 p-4 rounded-md">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-700 font-medium flex-1">
                          Price: <span className="font-bold">$34.99</span>
                          <span className="text-sm ml-2 text-gray-500">Free shipping on all orders</span>
                        </p>
                        <Button 
                          className="bg-book-green hover:bg-green-600 text-white"
                          onClick={handleCreateBookClick}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
            
            <CardFooter className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={isFirstStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              
              {isLastStep ? (
                <Button 
                  className="bg-book-red hover:bg-red-600 text-white"
                  onClick={handleCreateBookClick}
                >
                  Create Your Book
                </Button>
              ) : (
                <Button 
                  onClick={nextStep} 
                  className="bg-book-red hover:bg-red-600 text-white flex items-center gap-2"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookCustomizer;
