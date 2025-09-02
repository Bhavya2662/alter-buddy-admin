interface IMentorNameProps {
  firstName: string;
  lastName: string;
}

interface IMentorContactProps {
  email: string;
  mobile: string;
  address: string;
}

export interface IMentorAuthProps {
  username: string;
  password: string;
}

interface IMentorAccountStatus {
  verification: boolean;
  block: boolean;
  online: boolean;
}

export interface IMentorProps {
  name: IMentorNameProps;
  contact: IMentorContactProps;
  auth: IMentorAuthProps;
  category: string[] | ICategoryProps[];
  specialists: string[];
  accountStatus: IMentorAccountStatus;
  acType: "MENTOR";
  inCall?: boolean;
  videoLink?: string;
  description?: string;
  image: string;
  languages: string[];
  status: boolean;
  qualification: string;
  createdAt?: string;
  _id?: string;
}

export interface ICategoryProps {
  _id?: string;
  title: string;
  status: boolean;
  createdAt?: string;
}
