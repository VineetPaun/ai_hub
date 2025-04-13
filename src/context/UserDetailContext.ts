import { createContext, type Dispatch, type SetStateAction } from "react";

export interface UserDetail {
  name?: string;
  picture?: string;
  _id?: string;
  email?: string;
}

export interface UserDetailContextType {
  userDetail: UserDetail | null;
  setUserDetail: Dispatch<SetStateAction<UserDetail | null>>;
}

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetail: null,
  setUserDetail: () => {},
});
