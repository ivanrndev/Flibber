export interface IUser {
  id: string;
  username: string;
  password: string;
}

export interface ILabItem {
  id: string;
  title: string;
  description: string;
  userID: string;
  isPublic: boolean;
}
