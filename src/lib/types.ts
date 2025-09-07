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
}
