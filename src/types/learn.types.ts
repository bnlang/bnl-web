export type LearnItem = {
  slug: string;
  title: string;
  titleBn: string;
  children?: LearnItem[];
};