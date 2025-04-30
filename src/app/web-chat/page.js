"use client";
import { useState ,useEffect ,useRef} from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import StartChatModal from './components/StartChatModal';
import {  GET_WAB_CHATLIST ,GET_CHAT_MESSAGES } from '@/utils/api';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import './styles.css';
import Cookies from 'js-cookie';
import { useChatContext } from './ChatContext';
// import withAuth from '@/components/withAuth';

const page = () => {
  const userToken1 = Cookies.get("token") || "";
  const { setAllChatLists ,setSelectedChat,selectedChat ,setMessages ,setAgentList,messages,allChatLists} = useChatContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false); // New state to control the form visibility
  const [wsobj, setWs] = useState(null); // State to hold the WebSocket instance
  const [userToken, setUserToken] = useState("")
  const audioRef = useRef(null); // Reference to the audio element
  const [chatNumber , setChatNumber] = useState("");
  let socket = useRef(null); // Use ref to store the WebSocket instance   {'event_name': 'ReadChat', 'event_data': {'lead_id': '2', 'event_msg': 'message read successfully'}
  useEffect(()=>{
    setUserToken(userToken1);
    setChatNumber(Cookies.get("chat_number"));
  },[userToken1])
  // Handle chat selection
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    localStorage.setItem("ActiveChat", JSON.stringify(chat));
    if(chat.unread>0){
      const GetUnreadCountData = {
        event_name: 'ReadChat',
        event_data: {
          senderId: String(chat.id),  // Convert lead_id to a string
          event_msg: "message read successfully"
        },
      };
      
      console.log("<><><><><>GetUnreadCountData<><><>><", GetUnreadCountData);
      wsobj.send(JSON.stringify(GetUnreadCountData));
      chat.unread = 0;  // This will update the unread count to 0
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };
  const [wabNumberId, setWabNumberId] = useState("")
  const handleSelectId = (id) =>{
    setWabNumberId(id)
  }

  // Back button to return to the sidebar
  const handleBackButtonClick = () => {
    setIsSidebarOpen(true);
    setSelectedChat(null);
  };

  // Toggle form visibility
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
 

  const fetchAllChatLists = async (selectedChatId=null) => {
    try {
      let options = {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${userToken}`,
          "Content-Type": "application/json",
        }
      };

      let result = await fetch("/api/getChatContact", options);

      if (result.ok) {
        const userData = await result.json();
        console.log("=== userData ====",userData);
        setAllChatLists(userData);
        console.log("==== selectedChatId ====",selectedChatId);

        let chat_data;
        
        if (selectedChatId) {
        // Convert selectedChatId to the appropriate type if necessary (e.g., number)
        const chatId = parseInt(selectedChatId, 10); // Assuming IDs are numbers
    
        // Find the chat data that matches the selectedChatId
        
    
        // Set selected chat state
          console.log("== inside selected chat is null  statement")
          chat_data = userData.find(data => data.id === chatId);
        }
       else{
       console.log("=== chatNumber =====",chatNumber);
        if(chatNumber!=""){
          console.log("== inside chat number data , finding data from mobile number");
          chat_data = userData.data.find(data => data.mobile === chatNumber);
          Cookies.remove("chat_number");
        }
       }

       console.log("==== chat_data ====",chat_data);

       if(chat_data) {
        console.log("==== chat_data=====",chat_data);
          setSelectedChat(chat_data);

        }
      }
    } catch (error) {
      console.log("Unexpected error occurred: ", error);
    }
  };

  
  useEffect(() => {
    console.log("== we are here to fetch the chat data useeffect");
    localStorage.setItem("ActiveChat",null);
    if(userToken){
      fetchAllChatLists(); // Fetch all chats initially

    }
  }, [wabNumberId,userToken]);

  
     // Fetch chat messages from API using the lead_id
  
     const fetchChatMessages = async (contactId) => {
      try {
        let data = {contactId};
        let options = {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json"
          },
        };
        let response = await fetch("/api/getContactMsg", options);

        if (response.ok) {
          const data = await response.json();
          setMessages(data); // Map API response to message array
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };



  useEffect(() => {

    const initiateWebSocket = () => {
      const notificationSound = new Audio('/mixkit-software-interface-start-2574.wav'); // Add your sound file here

      if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
        socket.current = new WebSocket("ws://localhost:5000");
        setWs(socket.current);

        socket.current.onopen = () => {
          const loginEventMessage = JSON.stringify({
            event_name: "register",
            data: { token: userToken },
          });
          socket.current.send(loginEventMessage);
          console.log('WebSocket connection opened');
        };
      } else {
        console.log('WebSocket is already connected');
      }
   
      socket.current.onmessage = (event) => {
     
        // console.log("Event Received ...", event);
        // let messageJson = event.data.replace(/aaabbb/g, '');
        let data = JSON.parse(event?.data);
        data = data?.data ;
        console.log("Event data ...", data);
        let ActiveChat = localStorage.getItem('ActiveChat');

        switch (data?.type) {
          case 'Report':
            // Update status of outgoing messages based on report
            setMessages((prevMessages) =>
              prevMessages.map((message) =>
                message.uuid == data.messageId 
                  ? { ...message, status: data.status }
                  : message
              )
            );

            setAllChatLists((prevAllChats) =>
              prevAllChats.map((chat) =>
                chat.id == data.receiverId
                  ? {
                      ...chat,
                      last_msg_status: data.status
                    }
                  : chat
              )
            );

            break;
  
          case 'Incoming':
            notificationSound.play();
            console.log('Received Incoming message:', data);
            
            ActiveChat = ActiveChat ? JSON.parse(ActiveChat) : null;
            if (ActiveChat && ActiveChat.id === data.senderId) {
              // Update messages if it's the active chat
              setMessages((prevMessages) => [...prevMessages, data]);

              setAllChatLists((prevAllChats) =>
                prevAllChats.map((chat) =>
                  chat.id == data.senderId
                    ? {
                        ...chat,
                        last_msg_time: data.created_at,
                        last_customer_msg_time: data.created_at,
                        last_msg: data.msg
                      }
                    : chat
                )
              );
              const GetUnreadCountData = {
                event_name: 'ReadChat',
                event_data: {
                  senderId: String(data.senderId),  // Convert lead_id to a string
                  event_msg: "message read successfully"
                },
              };
              
              socket.current.send(JSON.stringify(GetUnreadCountData));


            } else {
              // Increment unread count if not the active chat
              setAllChatLists((prevAllChats) =>
                prevAllChats.map((chat) =>
                  chat.id === data.senderId
                    ? {
                        ...chat,
                        unread: chat.unread ? chat.unread + 1 : 1,
                        last_msg_time: data.created_at,
                        last_customer_msg_time: data.created_at,
                        last_msg: data.msg
                      }
                    : chat
                )
              );
            }
            break;
            case 'Outgoing':

            notificationSound.play();
            console.log('Received Outgoing message:', data);
  
            ActiveChat = ActiveChat ? JSON.parse(ActiveChat) : null;
            if (ActiveChat && ActiveChat.id === data.senderId) {
              // Update messages if it's the active chat
              setMessages((prevMessages) => [...prevMessages, data]);

              setAllChatLists((prevAllChats) =>
                prevAllChats.map((chat) =>
                  chat.id == data.senderId
                    ? {
                        ...chat,
                        last_msg_time: data.created_at,
                        last_customer_msg_time: data.created_at,
                        last_msg: data.msg_type == "text"? data.msg : data.msg_type
                      }
                    : chat
                )
              );
            }
            break;  
  
          default:
            console.log('Unhandled message type:', data);
            break;
        }
      };
  
      socket.current.onclose = () => {
        console.log('WebSocket connection closed, reconnecting...');
        // setTimeout(initiateWebSocket, 3000); // Retry connection after 3 seconds
      };
  
      socket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    const cleanupWebSocket = () => {
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };

    // Hook to connect WebSocket when component mounts and cleanup on unmount
  
    if (userToken) {
      initiateWebSocket();
    }

    return () => {
      cleanupWebSocket();
    };
  }, [userToken]);

    
  return (
    <div className="main-container">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="left-container">
          <ChatSidebar 
          handleSelectChat={handleSelectChat}
          onOpenForm={handleOpenForm }  
          fetchChatMessages={fetchChatMessages}
          ws={wsobj}
          handleSelectId={handleSelectId}
          /> 
        </div>
      )}
    
      {/* Chat Window */}
      <div className={`right-container ${selectedChat ? 'open' : ''}`}>
        {selectedChat ? (
          <ChatWindow 
            onBackButtonClick={handleBackButtonClick} // Pass back button handler 
            fetchAllChatLists={fetchAllChatLists}
            ws={wsobj}
            fetchChatMessages={fetchChatMessages}
          />
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
      <StartChatModal 
       open={isFormOpen}
       onClose={handleCloseForm} 
       fetchAllChatLists={fetchAllChatLists}
       fetchChatMessages={fetchChatMessages}
       />
      <ToastContainer position="bottom-right" />  
      {/* <audio ref={audioRef} src="./web-chat/achive-sound-132273.mp3" preload="auto" /> */}
    </div>
  );
}

// export default withAuth(page,['Agent']);
export default page;