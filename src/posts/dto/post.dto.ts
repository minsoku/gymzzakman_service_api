export interface PostBodyDto {
  title: string;
  content: string;
  category: string;
  hashtags: string[] | null;
  lat: string;
  lng: string;
}
