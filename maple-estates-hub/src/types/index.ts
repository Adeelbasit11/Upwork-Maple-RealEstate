export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  type: "house" | "apartment" | "plot" | "commercial" | "villa";
  purpose: "buy" | "rent";
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  images: string[];
  features: string[];
  agent: { _id: string; name: string; email: string } | string;
  featured: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface Agent {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  agency: string;
  location: string;
  experience: number;
  bio: string;
  listings: number | Property[];
  verified: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: "user" | "agent" | "admin";
  isApproved: boolean;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  property: { _id: string; title: string; location: string; city: string; price: number; images: string[] } | string;
  agent: { _id: string; name: string; email: string } | string;
  message: string;
  status: "pending" | "responded";
  response?: string;
  createdAt: string;
}
