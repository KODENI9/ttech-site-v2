export interface MemberModel {
  id?: string;
  name: string;
  role: string;
  description: string;
  email: string;
  github?: string;
  image?: string; // URL de la photo (optionnelle)
}
