import { useState, useEffect } from "react";
import type { Message } from "../../types/messages/Message";
import { messageApi } from "../../api_services/messages/MessageAPIService";
import { jwtDecode } from "jwt-decode";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";

interface Props {
  token: string;
  otherUserId: number;
}

export function ChatWindow({ token, otherUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const decoded = jwtDecode<JwtTokenClaims>(token);
  const currentUserId = decoded.id;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await messageApi.getConversationMessages(
          token,
          otherUserId
        );

        const fetchedMessages: Message[] = Array.isArray(res)
          ? res
          : Array.isArray(res.data)
          ? res.data
          : [];
        setMessages(fetchedMessages.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [otherUserId, token]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const tempId = Date.now();
    const tempMessage: Message = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: otherUserId,
      content: trimmed,
      timestamp: new Date().toISOString(),
      is_read: false,
      conversation_id: 0,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInput("");

    try {
      const savedMessageRaw = await messageApi.sendMessage(
        token,
        otherUserId,
        trimmed
      );

      const savedMessage: Message =
        (savedMessageRaw as any)?.data ?? (savedMessageRaw as Message);

      if (savedMessage && savedMessage.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? savedMessage : m))
        );
      } else {
        console.warn("Backend returned invalid message:", savedMessageRaw);
      }
    } catch (err) {
      console.error("Failed to send message:", err);

      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-2xl overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) =>
          msg ? (
            <div
              key={msg.id || `tmp-${index}`}
              className={`flex ${
                msg.sender_id === otherUserId ? "justify-start" : "justify-end"
              } mb-2`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[70%] break-words ${
                  msg.sender_id === otherUserId
                    ? "bg-white shadow"
                    : "bg-blue-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className="flex p-2 border-t border-gray-300 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
