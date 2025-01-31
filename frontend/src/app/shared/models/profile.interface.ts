export interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: Date;
  listings?: {
    active: number;
    sold: number;
  };
  savedItems?: string[];
  ratings?: {
    average: number;
    count: number;
  };
}
