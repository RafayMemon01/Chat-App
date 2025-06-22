import React, { useEffect, useRef } from "react";
import { useChatStore } from "../Store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessagesInput from "./MessagesInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../Store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();


  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return ()=> unsubscribeFromMessages()
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
  const timeout = setTimeout(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 100); // delay to ensure DOM rendered
  return () => clearTimeout(timeout);
}, [messages]);
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages
            .map((message, index) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                 ref={index === messages.length - 1 ? messageEndRef : null}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser?.profilePic || "/avatar.png"
                          : selectedUser?.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>

                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {message.createdAt
                      ? formatMessageTime(message.createdAt)
                      : ""}
                  </time>
                </div>

                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
        </div>
      )}
      <MessagesInput />
    </div>
  );
};

export default ChatContainer;
