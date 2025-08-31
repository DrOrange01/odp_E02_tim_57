import axios from "axios";
import type { UserDto } from "../../models/users/UserDto";
import type { IUsersAPIService } from "./IUsersAPIService";
import type { User } from "../../types/users/User";

const API_URL: string = import.meta.env.VITE_API_URL + "user";

export const usersApi: IUsersAPIService = {
  async getSviKorisnici(token: string): Promise<UserDto[]> {
    try {
      const res = await axios.get<UserDto[]>(`${API_URL}s`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  },

  async getSviAdmini(token: string): Promise<User[]> {
    try {
      const res = await axios.get<User[]>(`${API_URL}s/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  },
  async getSviObicniKorisnici(token: string): Promise<UserDto[]> {
    try {
      const res = await axios.get<UserDto[]>(`${API_URL}s/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch {
      return [];
    }
  },
  async updateProfile(
    token: string,
    userData: {
      first_name: string;
      last_name: string;
      phone_number: string;
      profile_pic: string;
    }
  ): Promise<User> {
    try {
      const res = await axios.put<{ success: boolean; user: User }>(
        `${API_URL}/profile`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data.user;
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  },
};
