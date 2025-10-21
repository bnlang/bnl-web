export type Tutorial = {
  _id: string | number;
  title: { english: string; bangla: string; };
  summary: { english: string; bangla: string; };
  description: { english: string; bangla: string; };
  slug: string;
  category: string;
  thumbnail: string;
  tags?: string[];
  status: boolean;
  createdAt: string;
  updatedAt?: string;
};
