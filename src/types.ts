export interface Campaign {
  id: number;
  name: string;
  platform: 'facebook' | 'instagram';
  objective: string;
  status: 'active' | 'paused';
  budget: number;
  spent: number;
  ctr: number;
  cpc: number;
  aiScore: number;
  alerts: string[];
  lastUpdated: Date;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  // Meta Ads için ek alanlar
  creative?: {
    type: 'image' | 'video';
    url: string;
    title: string;
    description: string;
  };
  targeting?: {
    audience: string;
    ageRange: string;
    location: string;
    interests: string[];
  };
}