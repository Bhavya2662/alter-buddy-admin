interface ICommentProps {
  userId: string;
  body: string;
}

export interface IBlogsProps {
  _id?: string;
  body: string;
  label: string;
  subLabel: string;
  blogLink: string;
  comment?: ICommentProps[];
  createdAt?: string;
  updatedAt?: string;
}
