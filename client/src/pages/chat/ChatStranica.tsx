import { useState, useEffect } from "react";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage.ts";
import { usersApi } from "../../api_services/users/UsersAPIService.ts";
import { messageApi } from "../../api_services/messages/MessageAPIService.ts";
import type { UserDto } from "../../models/users/UserDto.ts";
import type { Message } from "../../types/messages/Message.ts";
import { jwtDecode } from "jwt-decode";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims.ts";

export function ChatPage() {
  const token = PročitajVrednostPoKljuču("authToken")!;
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  if (!token) return <p>Morate se prijaviti</p>;

  const currentUser = jwtDecode<JwtTokenClaims>(token);

  useEffect(() => {
    async function fetchUsers() {
      let fetchedUsers: UserDto[] = [];
      if (currentUser.uloga === "admin") {
        fetchedUsers = await usersApi.getSviAdmini(token);
      } else {
        fetchedUsers = await usersApi.getSviObicniKorisnici(token);
      }
      setUsers(fetchedUsers.filter((u) => u.id !== currentUser.id));
    }

    fetchUsers();
  }, [currentUser.id, currentUser.uloga, token]);

  useEffect(() => {
    if (!selectedUser) return;

    async function fetchMessages() {
      if (!selectedUser) return;
      const msgs = await messageApi.getConversationMessages(
        token,
        selectedUser.id
      );
      setMessages(msgs);
    }

    fetchMessages();
  }, [selectedUser, token]);

  const handleSend = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    const msg = await messageApi.sendMessage(
      token,
      selectedUser.id,
      newMessage
    );
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <h2 className="p-4 text-xl font-bold border-b">Korisnici</h2>
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`p-4 cursor-pointer hover:bg-gray-200 ${
              selectedUser?.id === user.id ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {user.korisnickoIme} ({user.uloga})
          </div>
        ))}
      </div>

      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs p-2 rounded-lg ${
                    msg.sender_id === currentUser.id
                      ? "bg-blue-400 text-white self-end"
                      : "bg-gray-300 self-start"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex">
              <input
                className="flex-1 border rounded-lg p-2 mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Unesite poruku..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button
                className="bg-blue-600 text-white px-4 rounded-lg"
                onClick={handleSend}
              >
                Pošalji
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Odaberite korisnika za chat
          </div>
        )}
      </div>
    </div>
  );
}
