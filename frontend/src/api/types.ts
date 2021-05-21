import { UserState } from "@/store/types";

export interface loginType extends UserState {
  token: string;
}
