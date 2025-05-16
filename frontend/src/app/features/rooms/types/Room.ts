export interface Room_To_Create {
  name: string;
  UserId: string;
}
export interface Room_To_Update {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomWithProductNumbers extends Room {
  activeDevices: number;
}
