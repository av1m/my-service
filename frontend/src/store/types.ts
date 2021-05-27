// eslint-disable-next-line
export interface RootStore {}
export interface AlertState extends RootStore {
  type: string;
  message: string;
}
export interface ServiceState extends RootStore {
  _id?: string;
  serviceId?: string;
  name: string;
  description?: string;
  photo?: string;
  price: number;
  tags: [string];
}
export interface IUser {
  _id: string;
  email: string;
  password?: string;
  lastname: string;
  firstname?: string;
  created_at: string;
  updated_at: string;
  profile?: string;
  token?: string;
  services?: [ServiceState];
  payments?: [string];
}
export interface UserState extends RootStore {
  user: IUser;
}
export function isUserState(object: any): object is UserState {
  return object && object._id !== undefined && object._id !== null;
}
export type AllState = RootStore & AlertState & ServiceState & UserState;

export type VForm = Vue & {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => boolean;
};
