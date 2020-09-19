import { Mdx } from './Mdx';

export type Article = {
  id: string;
  frontmatter: {
    title: string;
    date: string;
    author: string;
    summary: string;
    image: string;
    socialSharingImage: string;
    tags: string[];
    tweet: string;
    pinterestImage: string;
    seoTitle: string;
    seoDescription: string;
    interviewImage: string;
    interviewName: string;
    interviewJob: string;
  };
  fields: {
    slug: string;
  };
};

export type MdxArticle = Mdx<Article['frontmatter'], Article['fields']>;
