import { JsonLdProps } from './jsonld';
import type { Review, AggregateRating } from 'src/types';
export interface SoftwareAppJsonLdProps extends JsonLdProps {
    name: string;
    price: string;
    priceCurrency: string;
    applicationCategory?: string;
    operatingSystem?: string;
    review?: Review;
    aggregateRating?: AggregateRating;
}
declare function SoftwareAppJsonLd({ type, keyOverride, priceCurrency, price, aggregateRating, review, ...rest }: SoftwareAppJsonLdProps): JSX.Element;
export default SoftwareAppJsonLd;
