export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  listings: {
    active: number;
    sold: number;
  };
  savedItems: number[];
  ratings: {
    average: number;
    count: number;
  };
  verified?: boolean;
  lastActive?: string;
}