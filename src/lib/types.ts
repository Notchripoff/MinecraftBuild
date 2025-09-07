export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface Build {
  id: string;
  name: string;
  builderName: string;
  description: string;
  summary: string;
  imageUrl: string;
  tags: string[];
  status: 'pending' | 'approved';
  createdAt: Date;
  likes: number;
  comments: Comment[];
}
