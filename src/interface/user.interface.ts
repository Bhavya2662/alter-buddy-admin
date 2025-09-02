export interface IUserProps {
     _id?: string;
     name: { firstName: string; lastName: string };
     email: string;
     mobile: string;
     password: string;
     acType: UserAccountType;
     verified: boolean;
     block: boolean;
     online: boolean;
     createdAt?: string;
     updatedAt?: string;
}

export type UserAccountType = "USER" | "ADMIN";
