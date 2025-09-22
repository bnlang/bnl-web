export type LearnItem = {
  slug: string;
  title: string;
  titleBn: string;
  titleBanglish?: string;
  children?: LearnItem[];
};