// ChatContext.js
import Cookies from 'js-cookie';
import { createContext, useContext, useState } from 'react';
import { GET_WAB_CHATLIST } from '@/utils/api';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [allChatLists, setAllChatLists] = useState([]);
  const [messages, setMessages] = useState([]);
  const [agentLists, setAgentList] = useState([]);


  const value = {
    selectedChat,
    setSelectedChat,
    templates,
    setTemplates,
    allChatLists,
    setAllChatLists,
    messages,
    setMessages,
    agentLists,
    setAgentList,
  };



  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
