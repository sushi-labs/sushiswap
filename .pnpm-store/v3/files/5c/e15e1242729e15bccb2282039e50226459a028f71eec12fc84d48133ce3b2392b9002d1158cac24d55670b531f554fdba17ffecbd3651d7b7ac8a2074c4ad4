import { JsonLdProps } from './jsonld';
import type { Review, AggregateRating, AggregateOffer, Offers } from 'src/types';
export interface ProductJsonLdProps extends JsonLdProps {
    productName: string;
    images?: string[];
    description?: string;
    brand?: string;
    reviews?: Review[];
    aggregateRating?: AggregateRating;
    offers?: Offers | Offers[];
    aggregateOffer?: AggregateOffer;
    sku?: string;
    gtin8?: string;
    gtin13?: string;
    gtin14?: string;
    mpn?: string;
    color?: string;
    manufacturerName?: string;
    manufacturerLogo?: string;
    material?: string;
    slogan?: string;
    disambiguatingDescription?: string;
    productionDate?: string;
    purchaseDate?: string;
    releaseDate?: string;
    award?: string;
}
declare function ProductJsonLd({ type, keyOverride, images, brand, reviews, aggregateRating, manufacturerLogo, manufacturerName, offers, aggregateOffer, productName, ...rest }: ProductJsonLdProps): JSX.Element;
export default ProductJsonLd;
