import { useState } from "react";
import type { UserDto } from "../../models/users/UserDto";
import { ChatWindow } from "./ChatWindow";

interface Props {
  users: UserDto[];
  token: string;
}

export default function ConversationList({ users, token }: Props) {
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  return (
    <div className="flex gap-4 h-[500px]">
      <div className="w-1/3 border-r border-gray-300 overflow-y-auto p-2">
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-100 transition ${
                selectedUser?.id === user.id ? "bg-blue-200 font-semibold" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              {user.korisnickoIme}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3">
        {selectedUser ? (
          <ChatWindow token={token} otherUserId={selectedUser.id} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500"></div>
        )}
      </div>
    </div>
  );
}
