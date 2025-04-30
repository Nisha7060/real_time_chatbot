"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faEllipsisVertical, faArrowLeft, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import "./ChatWindow.css";
import { Box, IconButton, InputBase } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ChatInput from './sendChat';
import MessageRenderer from './MessageRenderer'; // Import the MessageRenderer
import { useChatContext } from '../ChatContext';
import default_image from "./images-removebg-preview.png";
import dayjs from 'dayjs'; // Date formatting library
import isToday from 'dayjs/plugin/isToday'; // Day.js plugin for checking "Today"
import isYesterday from 'dayjs/plugin/isYesterday'; // Day.js plugin for checking "Yesterday"
import weekday from 'dayjs/plugin/weekday'; // Day.js plugin for getting week names
import MessageInfoModal from "./MessageInfoModal";
import { toast } from 'react-toastify';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(weekday);

import Cookies from 'js-cookie';

const ChatWindow = ({ onBackButtonClick, fetchAllChatLists, ws, fetchChatMessages }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle for search box
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatEndRef = useRef(null); // Ref to scroll to the end of chat
  const [currentDate, setCurrentDate] = useState(null); // Track the current date during scrolling
  const [isDateVisible, setIsDateVisible] = useState(false); // Control the visibility of the current date

  const { selectedChat, setMessages, messages, agentLists, setAllChatLists , setSelectedChat} = useChatContext();

  const lead_id = selectedChat.id;
  const contactName = selectedChat.name;
  const contactImage = default_image;
  const wab_number_id = selectedChat?.wab_number_id;
  const Mobile = selectedChat.mobile;
  const agent_id = selectedChat?.assign_agent;
  const agent_name = selectedChat?.agent_name;
  const last_customer_msg_time = selectedChat?.last_customer_msg_time;
  const [hoveredMessage, setHoveredMessage] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(null);
  const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
  const [sampleMessageInfoData, setSampleMessageInfoData] = useState(false);



  const toggleReplyMenu = (index) => {  
    setIsMenuVisible((prev) => (prev == index ? null : index));
  };

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  const copyToClipboard = (msgData) => {
    navigator.clipboard.writeText(msgData.msg).then(() => {
      toast.info("message Copied Successfully...")
    });
  };

  const handleModalInfoOpen = (msgData) =>{
    setIsModalInfoOpen(true);
    setSampleMessageInfoData(msgData);
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (messages) {
      setFilteredMessages(messages); // Sync filteredMessages with messages

    }
  }, [messages]);


  // Helper function to get custom date label
  const getDateLabel = (date) => {
    const now = dayjs();
    const msgDate = dayjs(date);

    if (msgDate.isToday()) {
      return "Today";
    }
    if (msgDate.isYesterday()) {
      return "Yesterday";
    }
    if (msgDate.isSame(now, 'week')) {
      return msgDate.format('dddd'); // Return the day of the week (e.g., "Monday")
    }
    return msgDate.format('MMMM D, YYYY'); // For dates outside the current week
  };

  // Timer to hide date after scrolling


  const hideDateAfterTimeout = () => {
    setIsDateVisible(true); // Show date during scroll
    clearTimeout(window.dateHideTimeout);
    window.dateHideTimeout = setTimeout(() => {
      setIsDateVisible(false); // Hide after 3 seconds
    }, 2000);
  };




  // Observe the messages and track the visible message to show its date at the top
  const messageRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const date = entry.target.getAttribute('data-date');
            setCurrentDate(date);
            hideDateAfterTimeout(); // Trigger timeout to hide the date
          }
        });
      },
      { threshold: 0.1 } // Adjust threshold based on your needs
    );

    messageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      messageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [filteredMessages]);

  const fetchTags = async () => {
    try {
      let options = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({})
      };
      let response = await fetch("", options);

      if (response.ok) {
        const data = await response.json();
        setOptions(data.data);
      } else {
        console.error("Error fetching tags:", response.status);
      }
    } catch (error) {
      console.error("Error fetching chat tags:", error);
    }
  };




  const handleAddCollaboratorModal = () => {
    setIsCollabModalOpen(true);
  };

  const handleAgentTransModal = () => {
    setIsAgentTransModalOpen(true);
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(true); // Show search input over header
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false); // Close the search input
    setSearchTerm(''); // Clear the search term
    setFilteredMessages(messages); // Reset messages to all
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    console.log("<><><><><>messages<><><><>", messages);
    // const filtered = messages.filter((msg) => msg?.msg.toLowerCase().includes(term));

    const filtered = messages.filter((msg) =>
      [msg?.msg, msg?.last_customer_msg_time, msg?.sent_by, msg?.msg_type_desc?.body_text, msg?.msg_type_desc?.header_text, msg?.msg_type_desc?.footer_text] // Add other fields you want to search in
        .some((field) => field?.toLowerCase().includes(term.toLowerCase())) ||
      msg?.msg_type_desc?.buttons?.some((button) => button?.text?.toLowerCase().includes(term.toLowerCase()))

    );
    setFilteredMessages(filtered);
  };

  const handleCollaboratorInfoClick = () => {
    setIsSidebarOpen(true); // Open the sidebar when "Collaborator Info" is clicked
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // Close the sidebar
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages]);

  return (
    <>
      <div className="header">
        {/* Display the current date when visible */}
        {isDateVisible && currentDate && (
          <div className="topdate-container">

            <span className="topdate-divider"> <b>{getDateLabel(currentDate)}</b></span>
          </div>
        )}
        {!isSearchOpen && (
          <>

            <div className="contact-item">

              <div className="contact-row">
                <div className='profileName-row'>
                  <button className="back-button" onClick={onBackButtonClick}>
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                  </button>
                  <div className="user-img">
                    {contactImage ? (
                      <Image src={contactImage} alt={selectedChat.name} width={50} height={50} />
                    ) : (
                      <div className="initials">
                        {selectedChat.name && contactName !== 'NA'
                          ? contactName.charAt(0).toUpperCase()
                          : Mobile.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="contact-info">
                    <h5>{contactName && contactName !== 'NA' ? contactName : Mobile}</h5>
                    <p style={{ color: "#323f4a", fontSize: "small" }}>{selectedChat.mobile}</p>
                  </div>
                </div>
                {/* <div className='tags-row'>
                  {tag_names && tag_names !== "NA" && (
                    <div className="tag-container">
                      {tag_names.split(',').map((tag, index) => (
                        <span key={index} className="tag-item">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div> */}

              </div>
            </div>


            <div className="nav-icons">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <IconButton sx={{ color: '#4caf50', marginRight: 1 }} onClick={""}>
                  <LocalOfferIcon />
                </IconButton> */}

                <IconButton sx={{ color: '#51585c', marginRight: 0 }} style={{ "fontSize": "1.2rem" }} onClick={handleSearchIconClick}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </IconButton>
              </Box>
            </div>
          </>
        )}

        {isSearchOpen && (
          <div className="search-overlay">
            <div className="search-box-overlay">
              <InputBase
                placeholder="Search messages"
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: '#4caf50',
                  width: 'calc(100% - 40px)',
                }}
                autoFocus
              />
              <IconButton onClick={handleCloseSearch} sx={{ padding: '5px', marginLeft: '5px' }}>
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            </div>
          </div>
        )}
      </div>



      <div className="chat-container">
        {/* Group messages by date */}
        {filteredMessages.length > 0 && (
          <>
            {filteredMessages
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Sort in ascending order
              .map((msg, idx) => {
                const showDate =
                  idx === 0 ||
                  dayjs(filteredMessages[idx].created_at).format('DD/MM/YYYY') !==
                  dayjs(filteredMessages[idx - 1].created_at).format('DD/MM/YYYY');
                return (
                  <div
                    key={idx}
                    ref={(el) => (messageRefs.current[idx] = el)}
                    data-date={msg.created_at}
                    className="message-wrapper"
                    onMouseEnter={() => setHoveredMessage(idx)}
                    onMouseLeave={() => {
                      if (hoveredMessage !== null) setHoveredMessage(null);
                      if (isMenuVisible !== null) setIsMenuVisible(null);
                    }}                  >
                    {/* Display date divider if necessary */}
                    {showDate && (
                      <div className="date-container">
                        <span className="date-divider">
                          <b>{getDateLabel(msg.created_at)}</b>
                        </span>
                      </div>
                    )}

                    <div
                      className={`message-box ${msg.type === 'Outgoing'
                          ? 'my-message'
                          : msg.type === 'system_specific'
                            ? 'system-message'
                            : 'friend-message'
                        }`}
                      style={
                        msg.type === 'system_specific'
                          ? { textAlign: 'center', fontStyle: 'italic' }
                          : {}
                      }
                    >
                      {msg.type === 'system_specific' ? (
                        <span className="system-tag">{msg.msg}</span>
                      ) : (
                        <>
                          <MessageRenderer msg={msg} isOutgoing={msg.type === 'Outgoing'} socket={ws} />
                          {/* Menu Icon and Dropdown    */}
                          {msg.type === 'Outgoing' && hoveredMessage == idx   && (
                            <div className="menu-button-container">
                              <svg onClick={() => toggleReplyMenu(idx)} viewBox="0 0 30 30" height="30" width="30" className="menu-icon text-secondary" >
                                <path fill="currentColor" d="M11,21.212L17.35,15L11,8.65l1.932-1.932L21.215,15l-8.282,8.282L11,21.212z" />
                              </svg>
                              {isMenuVisible == idx && (
                                <div
                                  className="message-menu"
                                  onClick={(e) => e.stopPropagation()} // Prevent menu clicks from closing it 
                                >
                                 {msg.msg_type !="template"  && <button onClick={() => copyToClipboard(msg)}>Copy</button> } 
                                  <button onClick={() => handleModalInfoOpen(msg)}>Message Info</button>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

          </>
        )}
        <div ref={chatEndRef} />
      </div>


      <ChatInput
        lead_id={lead_id}
        setMessages={setMessages}
        messages={messages}
        wab_number_id={wab_number_id}
        agent_id={agent_id}
        number={Mobile}
        last_customer_msg_time={last_customer_msg_time}
        ws={ws}
        setAllChatLists={setAllChatLists}
        agent_name={agent_name}
      />


        <MessageInfoModal
        isOpen={isModalInfoOpen}
        onClose={() => setIsModalInfoOpen(false)}
        messageData={sampleMessageInfoData}
      />

    </>
  );
};

export default ChatWindow;
