import { IUserProps } from "./user.interface";

export interface IBuddyCoinsProps {
  balance: number;
  userId: string | IUserProps;
}
