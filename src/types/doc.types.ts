export type DocItem = {
  slug: string;
  title: string;
  titleBn: string;
  children?: DocItem[];
};

export type VersionMap = Record<string, DocItem[]>;