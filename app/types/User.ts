// models/userModel.ts
// models/userModel.ts

export interface UserModel {
  uid: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  createdAt: Date;
  challengePassed: boolean; // ✅ nouveau champ
}
