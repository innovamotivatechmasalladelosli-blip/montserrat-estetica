export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  priceRange?: string;
  duration: number; // in minutes
  imageUrl: string;
  category: string;
  tags: string[];
  features?: string[];
  isFeatured?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  isAvailableToday?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
    }
  }
}
