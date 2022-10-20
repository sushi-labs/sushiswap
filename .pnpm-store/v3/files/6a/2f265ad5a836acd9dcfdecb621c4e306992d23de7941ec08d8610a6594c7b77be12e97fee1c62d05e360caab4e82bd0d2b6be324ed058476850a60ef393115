import { JsonLdProps } from './jsonld';
import type { Address, Geo, AggregateRating, Review, Action, GeoCircle, OpeningHoursSpecification, Offer } from 'src/types';
export interface LocalBusinessJsonLdProps extends JsonLdProps {
    type: string;
    id: string;
    name: string;
    description: string;
    url?: string;
    telephone?: string;
    address: Address;
    geo?: Geo;
    images?: string[];
    rating?: AggregateRating;
    review?: Review[];
    priceRange?: string;
    servesCuisine?: string | string[];
    sameAs?: string[];
    openingHours?: OpeningHoursSpecification | OpeningHoursSpecification[];
    action?: Action;
    areaServed?: GeoCircle[];
    makesOffer?: Offer[];
}
declare function LocalBusinessJsonLd({ type, keyOverride, address, geo, rating, review, action, areaServed, makesOffer, openingHours, images, ...rest }: LocalBusinessJsonLdProps): JSX.Element;
export default LocalBusinessJsonLd;
