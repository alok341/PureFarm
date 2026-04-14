/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
} from "../redux/slices/messageSlice";
import Loader from "../components/Loader";
import { FaArrowLeft, FaPaperPlane, FaUserCircle } from "react-icons/fa";

const ConversationPage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const { messages, loading } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.auth);

  const conversationMessages = messages[userId] || [];

  useEffect(() => {
    dispatch(getConversationMessages(userId));
    dispatch(markMessagesAsRead(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    dispatch(
      sendMessage({
        receiver: userId,
        content: newMessage,
      })
    );
    setNewMessage("");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (loading && conversationMessages.length === 0) {
    return <Loader />;
  }

  // Get conversation partner name
  const getPartnerName = () => {
    if (conversationMessages.length > 0) {
      const firstMessage = conversationMessages[0];
      return firstMessage.sender._id === user._id
        ? firstMessage.receiver.name
        : firstMessage.sender.name;
    }
    return "Conversation";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/messages"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6 transition-colors duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Messages
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {getPartnerName()}
                </h2>
                <p className="text-teal-100 text-sm">Online</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[60vh] overflow-y-auto bg-gray-50 p-6">
            {conversationMessages.length > 0 ? (
              <div className="space-y-4">
                {/* Date separator for first message */}
                <div className="flex justify-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {formatDate(conversationMessages[0]?.createdAt)}
                  </span>
                </div>
                
                {conversationMessages.map((message, index) => {
                  const isOwn = message.sender._id === user._id;
                  const showDateSeparator = index > 0 && 
                    formatDate(message.createdAt) !== formatDate(conversationMessages[index - 1]?.createdAt);
                  
                  return (
                    <div key={message._id}>
                      {showDateSeparator && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
                        {!isOwn && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center mr-2 flex-shrink-0">
                            <FaUserCircle className="text-white text-sm" />
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] rounded-2xl p-3 transition-all duration-200 ${
                            isOwn
                              ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-br-none"
                              : "bg-white border border-gray-200 shadow-sm rounded-bl-none hover:shadow-md"
                          }`}
                        >
                          <p className="mb-1 break-words">{message.content}</p>
                          <p
                            className={`text-xs ${
                              isOwn
                                ? "text-teal-100"
                                : "text-gray-400"
                            } text-right`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                        {isOwn && (
                          <div className="w-8 h-8 flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <FaPaperPlane className="text-teal-600 text-2xl" />
                </div>
                <p className="text-gray-500 text-center">
                  No messages yet.
                  <br />
                  Start the conversation!
                </p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Type your message..."
                autoComplete="off"
              />
              <button
                type="submit"
                className={`px-5 py-3 rounded-xl transition-all duration-200 ${
                  newMessage.trim() === ""
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:shadow-lg hover:scale-105 text-white"
                }`}
                disabled={newMessage.trim() === ""}
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;