import { createContext, Dispatch, SetStateAction } from 'react';

export interface User {
  anilistId: string;
  anilistToken: string;
  mdSessionToken: string;
  mdRefreshToken: string;
}

interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export const defaultUser = {
  anilistId: '',
  anilistToken: '',
  mdSessionToken: '',
  mdRefreshToken: '',
};

export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});
