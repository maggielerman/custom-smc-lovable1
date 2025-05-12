
import { BookPage } from "../components/book/BookPageContent";

export const generatePages = (
  childName: string, 
  childAge: string, 
  familyStructure: string, 
  conceptionType: string
): BookPage[] => {
  const pages: BookPage[] = [
    // Introduction page
    {
      title: `${childName ? childName + "'s" : "Your"} Special Story`,
      content: `This is a story about how ${childName || "you"} came to be part of our wonderful family.`,
      color: "bg-soft-blue",
    },
  ];
  
  // Family structure page
  let familyStructureContent = "";
  let familyEmoji = "👨‍👩‍👧";
  
  switch(familyStructure) {
    case "single-mom":
      familyStructureContent = `${childName || "You"} have a loving mom who wanted a child more than anything in the world.`;
      familyEmoji = "👩‍👧";
      break;
    case "single-dad":
      familyStructureContent = `${childName || "You"} have a loving dad who wanted a child more than anything in the world.`;
      familyEmoji = "👨‍👧";
      break;
    case "two-moms":
      familyStructureContent = `${childName || "You"} have two loving moms who wanted to start a family together.`;
      familyEmoji = "👩‍👩‍👧";
      break;
    case "two-dads":
      familyStructureContent = `${childName || "You"} have two loving dads who wanted to start a family together.`;
      familyEmoji = "👨‍👨‍👧";
      break;
    default:
      familyStructureContent = `${childName || "You"} have a loving mom and dad who wanted to start a family together.`;
  }
  
  pages.push({
    title: "Our Family",
    content: familyStructureContent,
    color: "bg-gentle-pink",
    emoji: familyEmoji
  });
  
  // Conception type page
  let conceptionContent = "";
  let conceptionEmoji = "🔬";
  
  switch(conceptionType) {
    case "iui":
      conceptionContent = "The doctors helped us by placing a tiny seed in mom's body. This special seed helped create you!";
      break;
    case "donor-egg":
      conceptionContent = "A kind woman shared a tiny egg cell to help us make you. This special gift was a crucial part of your beginning.";
      conceptionEmoji = "🥚";
      break;
    case "donor-sperm":
      conceptionContent = "A kind donor shared a tiny seed to help us make you. This special gift was exactly what we needed to start our family.";
      conceptionEmoji = "🌱";
      break;
    case "donor-embryo":
      conceptionContent = "A generous family shared a tiny embryo with us. This special gift grew into you!";
      conceptionEmoji = "✨";
      break;
    default:
      conceptionContent = "The doctors combined a tiny egg and seed in a special lab. Then they carefully placed you in mom's womb to grow.";
  }
  
  pages.push({
    title: "A Special Beginning",
    content: conceptionContent,
    color: "bg-calm-yellow",
    emoji: conceptionEmoji
  });
  
  // Closing page
  pages.push({
    title: "Growing With Love",
    content: `And that's how our family's journey with ${childName || "you"} began. Every family is created differently, but all families are made with love.`,
    color: "bg-soft-purple",
    emoji: "💕"
  });
  
  return pages;
};
