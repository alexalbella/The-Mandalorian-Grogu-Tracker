import { Era } from '@/data/starwars-list';

export type SeriesTheme = 'mando' | 'maul';

export interface SeriesConfig {
  id: string;
  title: string;
  subtitle: string;
  theme: SeriesTheme;
  eras: Era[];
  quote: string;
  releaseDate: string;
  releaseType: 'movie' | 'series';
}
