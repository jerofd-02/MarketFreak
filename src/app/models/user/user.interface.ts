export interface User {
  seller: string;
  name: string;
  email: string;
  photo: string;
  location: string;
  description: string;
}

export interface UserResponse {
  users: User[];
}
