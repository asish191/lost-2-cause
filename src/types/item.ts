export interface Item {
  _id?: string;
  publicId: string;
  itemName: string;
  itemDescription: string;
  status: string;
  floor: number;
  tags: string[];
  uploaderName: string;
  uploaderId: string;
  uploadedAt: string;
  __v?: number;
  imageUrl: string;
}