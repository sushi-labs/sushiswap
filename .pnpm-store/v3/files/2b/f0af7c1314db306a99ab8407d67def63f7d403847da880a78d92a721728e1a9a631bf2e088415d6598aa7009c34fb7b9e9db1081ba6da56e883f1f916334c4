import type { Address, OrganizationCategory, ContactPoint } from 'src/types';
import { JsonLdProps } from './jsonld';
export interface OrganizationJsonLdProps extends JsonLdProps {
    type?: OrganizationCategory;
    id?: string;
    name: string;
    logo?: string;
    url: string;
    legalName?: string;
    sameAs?: string[];
    address?: Address;
    contactPoints?: ContactPoint[];
}
declare function OrganizationJsonLd({ type, keyOverride, address, contactPoints, ...rest }: OrganizationJsonLdProps): JSX.Element;
export default OrganizationJsonLd;
