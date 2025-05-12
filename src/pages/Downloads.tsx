
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ColoringProvider } from '@/context/ColoringContext';
import ColoringCanvas from '@/components/coloring/ColoringCanvas';
import ColorPalette from '@/components/coloring/ColorPalette';
import BrushSize from '@/components/coloring/BrushSize';
import ColoringPageCard from '@/components/coloring/ColoringPageCard';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const coloringPages = [
  {
    id: 1,
    title: "Family",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=500&h=500&fit=crop&q=80&fm=jpg&crop=entropy&auto=format&fit=max",
  },
  {
    id: 2,
    title: "Flowers",
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=500&fit=crop&q=80&fm=jpg&crop=entropy&auto=format&fit=max",
  },
  {
    id: 3,
    title: "Nature Bridge",
    imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=500&h=500&fit=crop&q=80&fm=jpg&crop=entropy&auto=format&fit=max",
  },
  {
    id: 4,
    title: "Pine Trees",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&h=500&fit=crop&q=80&fm=jpg&crop=entropy&auto=format&fit=max",
  },
  {
    id: 5,
    title: "Mountain View",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=500&fit=crop&q=80&fm=jpg&crop=entropy&auto=format&fit=max",
  },
  {
    id: 6,
    title: "Foggy Summit",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=500&fit=crop&q=80&fm=jpg&crop=entropy&auto=format&fit=max",
  },
];

const Downloads: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState(coloringPages[0]);
  const [activeTab, setActiveTab] = useState('browse');

  return (
    <ColoringProvider>
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Free Coloring Pages | Little Origins Books</title>
          <meta name="description" content="Download and customize free coloring pages for your children. Personalized coloring activities to complement your Little Origins books." />
        </Helmet>
        <Navbar />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Free <span className="text-book-red">Coloring</span> Pages
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose from our collection of free coloring pages. Customize with our online coloring tool and download to print at home.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="browse">Browse Pages</TabsTrigger>
                  <TabsTrigger value="color">Color & Download</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="browse" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coloringPages.map((page) => (
                    <ColoringPageCard
                      key={page.id}
                      imageUrl={page.imageUrl}
                      title={page.title}
                      isSelected={page.id === selectedPage.id}
                      onClick={() => {
                        setSelectedPage(page);
                        setActiveTab('color');
                      }}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="color" className="space-y-6 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedPage.title}</h2>
                  <button 
                    className="text-book-red hover:text-book-red/70"
                    onClick={() => setActiveTab('browse')}
                  >
                    Back to Browse
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <ColoringCanvas imageUrl={selectedPage.imageUrl} />
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-3">Color Palette</h3>
                      <ColorPalette />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-3">Brush Settings</h3>
                      <BrushSize />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h3 className="font-medium mb-3">Instructions</h3>
                      <ul className="text-sm space-y-2 text-gray-600">
                        <li>• Click and drag to color the image</li>
                        <li>• Select colors from the palette above</li>
                        <li>• Adjust brush size as needed</li>
                        <li>• Click the Download button to save your work</li>
                        <li>• Click Reset to start over</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </ColoringProvider>
  );
};

export default Downloads;
