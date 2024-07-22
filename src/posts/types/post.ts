export interface Post {
  id: number;
  author_id: number;
  title: string;
  content: string;
  like_count: number;
  dislike_count: number;
  view_count: number;
  category: string;
  lat: string;
  lng: string;
  is_liked: number;
  is_disliked: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  comment_id: number | null;
  post_id: number | null;
  user_id: number;
  comment_content: string | null;
  comment_created_at: string | null;
  commentUserProfile: string;
  commentUserNickname: string;
}

export interface Author {
  nickname: string;
  profileImage: string;
}

export type QueryResult = (Post & Comment & Author)[];
