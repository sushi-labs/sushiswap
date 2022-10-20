import { JsonLdProps } from './jsonld';
import { ArticleAuthor } from 'src/types';
export interface ArticleJsonLdProps extends JsonLdProps {
    type?: 'Article' | 'Blog' | 'NewsArticle';
    url: string;
    title: string;
    images: ReadonlyArray<string>;
    datePublished: string;
    dateModified?: string;
    authorName: string | string[] | ArticleAuthor | ArticleAuthor[];
    description: string;
    publisherName?: string;
    publisherLogo?: string;
}
declare function ArticleJsonLd({ type, keyOverride, url, title, images, datePublished, dateModified, authorName, publisherName, publisherLogo, description, }: ArticleJsonLdProps): JSX.Element;
export default ArticleJsonLd;
