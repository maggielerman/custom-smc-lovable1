
import React from 'react';

interface ProductSchemaProps {
  bookTitle: string;
  price: number;
  description?: string;
  image?: string;
}

const ProductSchema: React.FC<ProductSchemaProps> = ({ 
  bookTitle = "Custom Children's Book", 
  price, 
  description = "A personalized children's book explaining donor conception with love and care", 
  image = "https://lovable.dev/opengraph-image-p98pqg.png" 
}) => {
  // Format price from cents to dollars for schema
  const formattedPrice = (price / 100).toFixed(2);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": bookTitle,
    "image": image,
    "description": description,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": formattedPrice,
      "availability": "https://schema.org/InStock"
    },
    "brand": {
      "@type": "Brand",
      "name": "Little Origins Books"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ProductSchema;
