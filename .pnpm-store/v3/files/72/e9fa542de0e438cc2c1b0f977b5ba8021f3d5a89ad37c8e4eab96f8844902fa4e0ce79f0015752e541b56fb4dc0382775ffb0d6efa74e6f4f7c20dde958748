import { JsonLdProps } from './jsonld';
import type { Location, AggregateOffer, Offers, Performer, Organizer, EventStatus, EventAttendanceMode } from 'src/types';
export interface EventJsonLdProps extends JsonLdProps {
    name: string;
    startDate: string;
    endDate: string;
    location: Location;
    url?: string;
    description?: string;
    images?: string[];
    offers?: Offers | Offers[];
    aggregateOffer?: AggregateOffer;
    performers?: Performer | Performer[];
    organizer?: Organizer;
    eventStatus?: EventStatus;
    eventAttendanceMode?: EventAttendanceMode;
}
declare function EventJsonLd({ type, keyOverride, location, images, offers, aggregateOffer, performers, organizer, eventStatus, eventAttendanceMode, ...rest }: EventJsonLdProps): JSX.Element;
export default EventJsonLd;
