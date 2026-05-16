export type Blog = {
  _id: string | number;
  title: { english: string; bangla: string; };
  summary: { english: string; bangla: string; };
  description: { english: string; bangla: string; };
  slug: string;
  category: string;
  thumbnail: string;
  status: boolean;
  created_at: string;
  updated_at?: string;
};
