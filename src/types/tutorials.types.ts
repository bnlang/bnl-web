export type Tutorial = {
  _id: string | number;
  title: { english: string; bangla: string; banglish: string };
  summary: { english: string; bangla: string; banglish: string };
  description: { english: string; bangla: string; banglish: string };
  slug: string;
  category: string;
  thumbnail: string;
  tags?: string[];
  status: boolean;
  createdAt: string;
  updatedAt?: string;
};
