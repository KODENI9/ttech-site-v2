export interface ProjectModel {
  id: string;
  uid: string;
  title: string;
  description: string;
  link?: string;
  createdAt: Date;
  progress: number;
}
