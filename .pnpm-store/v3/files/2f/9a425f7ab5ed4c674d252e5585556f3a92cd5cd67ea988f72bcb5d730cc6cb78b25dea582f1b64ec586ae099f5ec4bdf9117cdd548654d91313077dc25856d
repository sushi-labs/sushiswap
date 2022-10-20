import { JsonLdProps } from './jsonld';
import type { CourseJsonLdProps, RecipeJsonLdProps } from 'src/index';
import type { Review, AggregateRating } from 'src/types';
declare type Director = {
    name: string;
};
interface DefaultDataProps {
    url: string;
}
interface ExtendedCourseJsonLdProps extends DefaultDataProps, CourseJsonLdProps {
}
interface ExtendedRecipeJsonLdProps extends DefaultDataProps, RecipeJsonLdProps {
}
export interface MovieJsonLdProps {
    name: string;
    url: string;
    image: string;
    dateCreated?: string;
    director?: Director | Director[];
    review?: Review;
    aggregateRating?: AggregateRating;
}
export interface CarouselJsonLdProps extends JsonLdProps {
    ofType: 'default' | 'movie' | 'recipe' | 'course';
    data: any | DefaultDataProps[] | MovieJsonLdProps[] | ExtendedCourseJsonLdProps[] | ExtendedRecipeJsonLdProps[];
}
declare function CarouselJsonLd({ type, keyOverride, ofType, data, }: CarouselJsonLdProps): JSX.Element;
export default CarouselJsonLd;
