import { createContext } from "react";

export interface UserDetail {
  name?: string;
  picture?: string;
  _id?: string;
  email?: string;
}

export type UserDetailContextType = {
  userDetail: UserDetail | null;
  setUserDetail: (detail: UserDetail | null) => void;
}

const defaultContext: UserDetailContextType = {
  userDetail: null,
  setUserDetail: () => { },
};

export const UserDetailContext = createContext<UserDetailContextType>(defaultContext);