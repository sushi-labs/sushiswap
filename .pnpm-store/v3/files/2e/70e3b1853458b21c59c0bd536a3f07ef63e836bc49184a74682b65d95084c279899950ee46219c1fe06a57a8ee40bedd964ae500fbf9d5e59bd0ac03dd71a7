import { JsonLdProps } from './jsonld';
export interface NewsArticleJsonLdProps extends JsonLdProps {
    url: string;
    title: string;
    images: ReadonlyArray<string>;
    section: string;
    keywords: string;
    dateCreated: string;
    datePublished: string;
    dateModified?: string;
    authorName: string | string[];
    description: string;
    body: string;
    publisherName: string;
    publisherLogo: string;
}
declare function NewsArticleJsonLd({ type, keyOverride, url, title, images, section, dateCreated, datePublished, dateModified, authorName, publisherName, publisherLogo, body, ...rest }: NewsArticleJsonLdProps): JSX.Element;
export default NewsArticleJsonLd;
