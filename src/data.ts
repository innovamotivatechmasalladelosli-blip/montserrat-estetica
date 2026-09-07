import { Service, Stylist } from './types';

export const categories = [
  "Colorimetría",
  "Alisados y Reconstrucción",
  "Corte y Styling",
  "Nutrición Profunda",
  "Manicura y Pedicura"
];

export const services: Service[] = [
  {
    id: "s1",
    title: "Balayage Signature y Gloss",
    description: "Técnica artesanal a mano alzada con gradación natural hacia las puntas, sellada con baño de gloss polarizado para neutralizar reflejos cálidos y potenciar un reflejo dimensional.",
    price: 3600,
    priceRange: "$3,600 - $4,800",
    duration: 180,
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop",
    category: "Colorimetría",
    tags: ["MAÎTRE COLORISTE", "SUTIL ANTES / DESPUÉS", "RANGO EXCLUSIVO"],
    features: ["Línea de Tratamiento:", "Olaplex Nº1 y Kérastase Gloss"],
    isFeatured: true
  },
  {
    id: "s2",
    title: "Terapia Celular y Botox Capilar",
    subtitle: "RECONSTRUCCIÓN BOND",
    description: "Recuperación profunda de enlaces de queratina con ácido...",
    price: 2200,
    duration: 90,
    imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop",
    category: "Alisados y Reconstrucción",
    tags: []
  },
  {
    id: "s3",
    title: "Corte de Precisión y Styling",
    subtitle: "VISAGISME & STYLE",
    description: "Asesoría visagista según estructura facial, lavado sensorial...",
    price: 1500,
    duration: 60,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop",
    category: "Corte y Styling",
    tags: [],
    features: ["Aromaterapia incl."]
  },
  {
    id: "s4",
    title: "Detox y Masaje Ayurvédico",
    subtitle: "RITUAL CRANEAL",
    description: "Exfoliación suave de cuero cabelludo con microcámara...",
    price: 1200,
    duration: 45,
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&auto=format&fit=crop",
    category: "Nutrición Profunda",
    tags: [],
    features: ["Diagnóstico HD"]
  },
  {
    id: "s5",
    title: "Manicura Spa y Esmaltado Gel",
    subtitle: "RITUAL DE MANOS",
    description: "Exfoliación con sales minerales, hidratación profunda con mascarilla térmica y esmaltado en gel de larga duración con diseño minimalista opcional.",
    price: 900,
    duration: 60,
    imageUrl: "https://s3.theasianparent.com/tap-assets-prod/wp-content/uploads/sites/12/2018/01/manicure-process-picture-id838483760.jpg",
    category: "Manicura y Pedicura",
    tags: ["RELAJACIÓN PROFUNDA", "UÑAS PERFECTAS"],
    features: ["Sales Minerales", "Masaje Relajante"],
    isFeatured: true
  },
  {
    id: "s6",
    title: "Pedicura Botánica con Reflexología",
    subtitle: "CUIDADO INTEGRAL DE PIES",
    description: "Baño efervescente de hierbas aromáticas, tratamiento de durezas, masaje de reflexología podal de 20 min y esmaltado perfecto.",
    price: 1300,
    duration: 75,
    imageUrl: "https://images.unsplash.com/photo-1516975080661-460d3d5267a1?q=80&w=800&auto=format&fit=crop",
    category: "Manicura y Pedicura",
    tags: ["RITUAL EXCLUSIVO", "ALIVIO DE ESTRÉS"],
    features: ["Baño Botánico", "Reflexología"]
  }
];

export const stylists: Stylist[] = [
  {
    id: "st1",
    name: "Camille Laurent",
    title: "Directora Creativa y Master Balayage",
    rating: 4.9,
    reviews: 512,
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=200&auto=format&fit=crop",
    isAvailableToday: true
  },
  {
    id: "st2",
    name: "Mateo Valenti",
    title: "Especialista en Salud y Texturas Capilares",
    rating: 5.0,
    reviews: 340,
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: "st3",
    name: "Isabella Rossi",
    title: "Nail Artist y Especialista en Spa",
    rating: 4.8,
    reviews: 215,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    isAvailableToday: true
  }
];

export const products = [
  { id: 'p1', name: 'Bain Elixir Ultime', brand: 'Kérastase', price: 900, img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop' },
  { id: 'p2', name: 'No. 7 Bonding Oil', brand: 'Olaplex', price: 600, img: 'https://tse3.mm.bing.net/th/id/OIP.zDvvMFaK3UansmWKTFL4ngHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { id: 'p3', name: 'Masque Chromatique', brand: 'Kérastase', price: 1100, img: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&auto=format&fit=crop' },
];
