export interface QuietBlock {
  _id?: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuietBlockData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}