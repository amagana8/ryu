import { createContext, Dispatch, SetStateAction } from 'react';

interface User {
  anilistId: string;
  anilistToken: string;
  mangadexToken: string;
}

interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export const defaultUser = {
  anilistId: '',
  anilistToken: '',
  mangadexToken: '',
};

export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});
