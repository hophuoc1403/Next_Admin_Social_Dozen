interface IPost {
  id: number;
  createdAt: string;
  post: ISinglePost;
  tags: ITag[];
  user: IAccount;
  userRoot?: IUser;
  sharedContent?: string;
  likes: Like[];
  commentCount: number;
}

interface ISinglePost {
  description: string;
  id: number;
  picturePath: string;
}

interface ITag {
  id: number;
  name: string;
}

interface Like {
  id: number;
  user: IUser;
  post: IPost;
}