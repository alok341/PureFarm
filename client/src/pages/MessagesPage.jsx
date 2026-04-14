"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../redux/slices/messageSlice";
import MessageItem from "../components/MessageItem";
import Loader from "../components/Loader";
import { FaComments, FaInbox, FaEnvelope } from "react-icons/fa";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { conversations, loading } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaEnvelope className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Messages</h1>
              <p className="text-gray-600 mt-1">Connect with farmers and customers</p>
            </div>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mt-2"></div>
        </div>

        {/* Stats Summary */}
        {conversations.length > 0 && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FaComments className="text-teal-600 text-sm" />
                </div>
                <span className="text-sm text-gray-600">Total Conversations</span>
              </div>
              <span className="text-2xl font-bold text-teal-600">{conversations.length}</span>
            </div>
          </div>
        )}

        {/* Conversations List */}
        {conversations.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-100">
              {conversations.map((conversation) => (
                <MessageItem
                  key={conversation.user._id}
                  conversation={conversation}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg text-center py-16 px-4">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaComments className="text-teal-600 text-4xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Messages Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              You don't have any conversations yet. Start by messaging a farmer or responding to customer inquiries.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => window.location.href = "/farmers"}
                className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Browse Farmers
              </button>
              <button 
                onClick={() => window.location.href = "/products"}
                className="px-5 py-2 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-all duration-200"
              >
                Explore Products
              </button>
            </div>
          </div>
        )}

        {/* Empty State with No Conversations - Alternative View */}
        {conversations.length === 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-400">
              <FaInbox />
              <span>Your inbox is empty</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;