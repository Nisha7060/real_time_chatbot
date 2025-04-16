"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import dayjs from "dayjs";
import "./chatList.css"; // Ensure your styles include an 'active' class for the selected chat
import default_image from "./images-removebg-preview.png"
import { useChatContext } from '../ChatContext';
import { format } from 'date-fns'; // Ensure you have this import if using format from date-fns
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Cookies from 'js-cookie';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const ChatSidebar = ({handleSelectChat , onOpenForm ,fetchChatMessages ,ws, handleSelectId}) => {

  const type = Cookies.get("type");
  const wab_number_id = Cookies.get("wab_number_id")

  const { allChatLists } = useChatContext();
  const [filteredChatLists, setFilteredChatLists] = useState(allChatLists); // State for filtered chat list
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [activeChatId, setActiveChatId] = useState(null); // State for active chat
  const [isWabIds , setWabIds] = useState(true)
 

// handle click function
  const handleClick = (id) => {
    handleSelectId(id);
  };


   // set wab_number_id
   useEffect(()=>{
    if(type == "Agent")
    setWabIds(false)
    handleSelectId(wab_number_id);
  },[type]);

   // Client-side search filtering
   useEffect(() => {
    if (searchQuery) {
      const filtered = allChatLists.filter(chat => {
        const searchFields = [
          chat.name?.toLowerCase(), 
          chat.email?.toLowerCase(), 
          chat.mobile, 
          // chat.agent_id?.toString(), 
          chat.wab_tag_name?.toString()
        ];

        // Check if any field contains the search query
        return searchFields.some(field => field?.includes(searchQuery.toLowerCase()));
      });
      setFilteredChatLists(filtered);
    } else {
      setFilteredChatLists(allChatLists); // Reset to all chats when query is cleared
    }
  }, [searchQuery, allChatLists]);



  const truncateMessage = (message, maxLength) => {
    if (message && message.length > maxLength) {
      return `${message.substring(0, maxLength)}...`;
    }
    return message;
  };

  const formatTime = (time) => {
    const messageDate = dayjs(time);
    const today = dayjs().startOf('day');

    // If the message date is today, return the formatted time
    if (messageDate.isAfter(today)) {
        return messageDate.format('h:mm A'); // Example: '10:20 AM'
    }

    // If the message date is not today, return the formatted date
    return messageDate.format('YYYY-MM-DD'); // Format for older dates
};

  const handleChatClick = (chat) => {
    setActiveChatId(chat.id); // Set the active chat
    fetchChatMessages(chat.id)
    handleSelectChat(chat); // Pass the full chat object (id, name, image) to parent component
  };

  const getStatusTick = (status) => {
    switch (status) {
      case 'Send':
        return (
          <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" fill="none">
            <title>msg-check</title>
            <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832Z" fill="currentColor"></path>
          </svg>
        );
      case 'sent':
          return (
            <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" fill="none">
              <title>msg-check</title>
              <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832Z" fill="currentColor"></path>
            </svg>
          );  
      case 'received':
        return (
          <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" fill="none">
            <title>msg-dblcheck</title>
            <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path>
          </svg>
        );
      case 'delivered':
          return (
            <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" fill="none">
              <title>msg-dblcheck</title>
              <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path>
            </svg>
          );
      case 'read':
            return (
              <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg read">
                <title>msg-dblcheck-read</title>
                <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25ZM7.75 8.25L4.75 5.25L3.75 6.25L7.75 10.25L15.25 2.75L14.25 1.75L7.75 8.25Z" fill="#34B7F1"/> {/* Blue tick */}
              </svg>
            ); // Double blue tick for "read"
      default:
        return null;
    }
  };
  
  // Helper function to render icon and label based on message type
  const getMessageContent = (chat) => {
    switch (chat.last_msg_type) {
      case 'text':
        return <>{truncateMessage(chat.last_msg, 10)}</>; // Show text as it is
      case 'image':
        return (
          <>
            <ImageIcon sx={{fontSize: 16 }} /> Photo
          </>
        );
      case 'template':
        return (
          <>
            <TextSnippetIcon sx={{fontSize: 16 }} /> Template
          </>
        );
      case 'video':
        return (
          <>
            <VideoLibraryIcon sx={{ fontSize: 16,marginRight: 0.5 }} /> Video
          </>
        );
      case 'audio':
        return (
          <>
            <AudiotrackIcon sx={{ fontSize: 16, marginRight: 0.5 }} /> Audio
          </>
        );
      case 'document':
        return (
          <>
            <PictureAsPdfIcon sx={{fontSize: 16 , marginRight: 0.5 }} /> PDF
          </>
        );
      default:
        return (
          <>
            <InsertDriveFileIcon sx={{fontSize: 16 , marginRight: 0.5 }} /> File
          </>
        );
    }
  };

  

  return (
    <>
      {/* Header */}
      <div className="header" style={{border:"1px solid white"}}>
       <b>All Chats</b>
        <div className="nav-icons">
          {/* <li onClick={onOpenForm}><img src="https://static.thenounproject.com/png/946850-200.png" height={30} width={30} alt="Chat Icon" />
          </li> */}

          <li onClick={onOpenForm}>
            <svg viewBox="0 0 24 24" height="30" width="30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <title>New Chat</title>
              <path d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z" fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z" fill="currentColor"></path>
            </svg>
          </li>
        </div>
        {/* <StartChatModal open={isModalOpen} onClose={handleCloseModal} /> */}
      </div>

      {/* Search */}
     
    <div className="search-container">
      <div className="input">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input 
          type="text" 
          placeholder="Search or start new chat"  
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </div>
    </div>



      {/* Chat List */}
      <div className="chat-list">
      {filteredChatLists && 
          Object.keys(filteredChatLists)
            .map(key => filteredChatLists[key]) // Convert the object to an array
            .sort((a, b) => new Date(b.last_msg_time) - new Date(a.last_msg_time)) // Sort by last_msg_time desc
            .map(chat => {
            const userName = chat.name || "Unknown";
            const chatImage = chat.imageUrl || default_image;
            const wab_number_ids = chat.wab_number_id || null;
            const Mobile = chat.mobile || null;
            const tag_name = chat.wab_tag_name ;
            const tag_ids = chat.wab_tag_id ;
            const collaborator_ids = chat.collaborator_id ;


            return (
              <div
                className={`chat-box ${activeChatId === chat.id ? 'active' : ''}`} // Add 'active' class when selected
                key={chat.id}
                onClick={() => handleChatClick(chat)} // Pass chat details
              >
                <div className="img-box">
                  {chatImage ? (
                    <Image
                      className="img-cover"
                      src={chatImage}
                      alt="Chat"
                      style={{height:"55px", width:"55px"}}
                    />
                  ) : (
                    <div className="initials">
                      {userName && userName !== 'NA'
                        ? userName.charAt(0).toUpperCase()
                        : Mobile.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="chat-details">
                  <div className="chatlist-header">
                    <h5>{userName && userName !== 'NA' ? userName : Mobile}</h5>
                    <p className="time unread">{formatTime(chat.last_msg_time)}</p>
                  </div>
                  <div className="chat-message">
                    {/* <p>{truncateMessage(chat.last_msg, 10)} </p> */}
                    {chat.last_msg && chat.last_msg !== 'NA' && (
                      <p>
                        {getStatusTick(chat.last_msg_status)} {getMessageContent(chat)}
                        {/* {truncateMessage(chat.last_msg, 10)} */}
                      </p>
                    )}
                    {tag_name && tag_name !== 'NA' && <p className="highlight ms-2">{truncateMessage(tag_name, 10)}</p>}
                    {/* {tag_name && <p className="highlight ms-2">{truncateMessage(tag_name, 10)}</p> } */}
                    {chat.unread > 0 && <b className='unreader'>{chat.unread}</b>}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ChatSidebar;
