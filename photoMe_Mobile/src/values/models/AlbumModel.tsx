import UserModel from "./UserModel";

type AlbumModel = {
  photographerId: string;
  modelId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  photographer: UserModel[];
  albumType: string;
  photos: [];
  title: string;
  thumbnailPublicID: string;
  likesNumber: number;
};

export default AlbumModel;
