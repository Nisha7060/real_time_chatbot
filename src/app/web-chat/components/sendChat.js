import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceGrin, faPaperclip, faPaperPlane, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import { SEND_WAB_MEDIA } from '@/utils/api'; // Ensure you have the correct endpoint
import Cookies from 'js-cookie'; // For token management
import { FaFile, FaPhotoVideo, FaPoll } from 'react-icons/fa';
import TemplateModal from './TemplateModal';
import './ChatInput.css'; // Ensure you style it correctly
import MediaPreview from './MediaPreview'; // Import the MediaPreview component
import AddVariableModal from '../components/AddVariableModal';


const ChatInput = ({ lead_id, setMessages, messages, wab_number_id, getTemplates, templates ,agent_id,number,last_customer_msg_time,ws,setAllChatLists,agent_name,chatUnlocked}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const emojiRef = useRef(null);
  const mediaRef = useRef(null);
  const [isChatLocked, setIsChatLocked] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [TemplateData, setTemplateData] = useState({});
  const [variableValues, setVariableValues] = useState({});
  const name = Cookies.get("name");
  const user_id = Cookies.get("user_id");

  // console.log(variableValues);
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const handleSendMessage = async () => {
    // Check if there's a message or media to send
    try {
      let newMessages = [];
      const now = new Date();
  
      if (!ws) {
        console.error('WebSocket is not initialized.');
        return;
      }
  
      // Check if WebSocket is open before sending any message
      if (ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open. Message not sent.');
        return;
      }
  
      // Handle text message
      if (message.trim()) {
        const uuid = generateUUID(); // Function to generate UUID
  
        newMessages.push({
          msg: message,
          msg_type: 'text',
          type: 'Outgoing',
          status: 'sent',
          uuid,
          lead_id,
          sent_by:name,
          created_at: now.toISOString(),
        });
  
        const textEventData = {
          event_name: 'SendChat',
          event_data: {
            number,
            media_type: 'text',
            type: 'text',
            uuid,
            type_desc: message.trim(),
            whatsapp_number_id: wab_number_id,
            is_internal: false,
            assign_agent: user_id,
            lead_id: lead_id,
          },
        };
        setAllChatLists((prevAllChats) =>
          prevAllChats.map((chat) =>
            chat.id === lead_id
              ? {
                  ...chat,
                  last_msg_time: now.toISOString(),
                  last_msg: message.trim(),
                  last_msg_type:'text',
                  last_msg_status:"sent"
                }
              : chat
          )
        );
        ws.send(JSON.stringify(textEventData));
      }
  
      // Handle media messages
      const mediaPromises = mediaPreviews.map(async (file) => {

        console.log("<><><><><>file<><><><>",file);
        const msgType = file.type.startsWith('image/') ? 'image' :
                        file.type.startsWith('audio/') ? 'audio' :
                        file.type.startsWith('video/') ? 'video' : 'document'; // Default to 'file'
  
        const uuid = generateUUID(); // Generate UUID for the media
        const fileSize = formatFileSize(file.file.size); // Function to format file size
  
        const formData = new FormData();
        formData.append('file', file.file); // Append the file to the FormData object
  
        let options = {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Cookies.get("token")}`
          },
          body: formData
        };
  
        let response = await fetch(SEND_WAB_MEDIA, options);
  
        if (response.ok) {
          const data = await response.json();
          file.url = data.data[0].url; // Update the file URL after successful upload

          newMessages.push({
            msg: file.url,
            msg_type: msgType,
            file_name: file.file.name,
            file_size: fileSize,
            type: 'Outgoing',
            status: 'sent',
            uuid,
            sent_by:name,
            lead_id,
            created_at: now.toISOString(),
          });
    
          const mediaEventData = {
            event_name: 'SendChat',
            event_data: {
              number,
              media_type: 'media',
              type: msgType,
              uuid,
              type_desc: file.url,
              whatsapp_number_id: wab_number_id,
              assign_agent: user_id,
              is_internal: false,
              lead_id: lead_id,
            },
          };
          ws.send(JSON.stringify(mediaEventData));
          setAllChatLists((prevAllChats) =>
            prevAllChats.map((chat) =>
              chat.id === lead_id
                ? {
                    ...chat,
                    last_msg_time: now.toISOString(),
                    last_msg: file.url,
                    last_msg_type:msgType,
                    last_msg_status:"sent"
                  }
                : chat
            )
          );
          return true; // Indicate that media was handled successfully
        } else {

        console.log("Error SEND_WAB_MEDIA:", response.status);
        newMessages.push({
          msg: file.url,
          msg_type: msgType,
          file_name: file.file.name,
          file_size: fileSize,
          type: 'Outgoing',
          status: 'failed',
          uuid,
          sent_by:name,
          lead_id,
          created_at: now.toISOString(),
        });

        return true; // Indicate that media was handled successfully

        }

      });
  
      // Wait for all media uploads to complete
      await Promise.all(mediaPromises);
  
      
      // Update state with new messages only after all media uploads are done
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  
      // Reset input fields
      setMessage('');
      setMediaPreviews([]);
  
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  
  // Helper function to format file size (assuming it's defined somewhere)
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  // Example UUID generator function (if not already defined)
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0; // Generate a random value between 0 and 15
      const v = c === 'x' ? r : (r & 0x3) | 0x8; // If 'x', use the random value, if 'y', ensure the first hex digit is either 8, 9, A, or B
      return v.toString(16); // Convert the value to hexadecimal
    });
  };
  

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    // setShowEmojiPicker(false);
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setMediaPreviews((prev) => [...prev, ...newPreviews]);
    setIsPreviewOpen(true);

  };
  
  const closeModal = () => setIsModalOpen(false);

  const handleGetTemplates = () => {
    setIsModalOpen(true);
    getTemplates(wab_number_id);
  };


  const handleRemoveMedia = (index) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMedia = () => {

    // document.getElementById('media-input').click();
    const mediaInput = document.createElement('input');
  
    // Set the attributes of the input
    mediaInput.type = 'file';
    mediaInput.accept = 'image/*,video/*';  // Accept both images and videos
    mediaInput.multiple = true;  // Allow multiple files to be selected
    mediaInput.style.display = 'none';  // Hide the input from view
    
    // Append input to the body (or any other container)
    document.body.appendChild(mediaInput);
    
    // Set the onChange event to handle file upload
    mediaInput.onchange = (e) => handleFileUpload(e, 'media');
    
    // Trigger the click event to open the file dialog
    mediaInput.click();
    
    // Optionally, remove the input element from the DOM after use
    mediaInput.addEventListener('change', () => {
      document.body.removeChild(mediaInput);  // Remove after file selection 
    });

  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setMediaPreviews([]);
  };

  const handleSendTemplate = async (id) => {
    const temp_data = templates.find(template => template.id === id);
    if(temp_data.body_var > 0 || temp_data.body_var > 0){
      setTemplateData(temp_data);
      setShowModal(true);
      closeModal();
    }
    else{
      handleSendMessage(id);
      closeModal();

    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (mediaRef.current && !mediaRef.current.contains(event.target)) {
        setShowMediaOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentTime = new Date();
    const lastMessageTime = new Date(last_customer_msg_time);
    const timeDifferenceInHours = (currentTime - lastMessageTime) / 1000 / 3600;

    // Lock chat if more than 24 hours have passed
    if (timeDifferenceInHours > 24) {
      setIsChatLocked(true);
    }
    else if(chatUnlocked){
      setIsChatLocked(false);
    }
     else {
      setIsChatLocked(false);
    }
  }, [last_customer_msg_time]);

  const handleModalClose = () =>{
    setVariableValues({}); 
    setShowModal(false);
  };

  const SendVariableTemplate = async (tempId) =>{
    handleSendMessage(tempId);
    setShowModal(false);
  };

  return (

    <div className="chatbox-container">
       {isChatLocked ? (
      <div class="css-c83pp3">
        <p dir="ltr" style={{fontSize:"12px"}}>Reply window closed</p>
        <button class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium css-11jo3fn" tabindex="0" type="button" onClick={handleGetTemplates}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="css-12z0wuy">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <p dir="ltr"style={{fontSize:"12px"}} >Send template</p>
          <span class="MuiTouchRipple-root css-w0pj6f"></span>
        </button>
        </div>
      ) : (
    <>
      {showEmojiPicker && (
        <div className="emoji-picker above-input" ref={emojiRef}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

        {showMediaOptions && (
          <div className="media-options-modal above-input" ref={mediaRef}>
            <div className="media-option" onClick={() => document.getElementById('document-input').click()}>
              <FaFile className="media-icon" /> Document
            </div>
            <input
              type="file"
              id="document-input"
              style={{ display: 'none' }}
              // Accept any document file types
              accept="*/*"
              onChange={(e) => handleFileUpload(e, 'document')}
            />

            <div className="media-option" onClick={() => document.getElementById('media-input').click()}>
              <FaPhotoVideo className="media-icon" /> Photos & videos
            </div>
            <input
              type="file"
              id="media-input"
              style={{ display: 'none' }}
              // Accept all image and video file types
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e, 'media')}
              multiple
            />

            <div className="media-option" onClick={handleGetTemplates}>
              <FaPoll className="media-icon" /> Template
            </div>
          </div>
        )}


        {/* Media Previews */}
        {mediaPreviews.length > 0 && (
          <MediaPreview
           selectedFiles={mediaPreviews} 
           handleRemoveMedia={handleRemoveMedia}
           handleAddMedia={handleAddMedia}
           handleClosePreview={handleClosePreview}
           handleSendMessage={handleSendMessage}
          />
        )}

      <div className="chatbox-input">
        <FontAwesomeIcon
          icon={faFaceGrin}
          size="lg"
          className="ml-3"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowMediaOptions(false);
          }}
        />
        <FontAwesomeIcon
          icon={faPaperclip}
          size="lg"
          style={{ margin: '0% 2% 0% 3%' }}
          onClick={() => {
            setShowMediaOptions(!showMediaOptions);
            setShowEmojiPicker(false);
          }}
        />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FontAwesomeIcon
          icon={faPaperPlane}
          size="lg"
          style={{ margin: '0% 2% 0% 2%' }}
          onClick={handleSendMessage}
        />
      </div>
    </>
    )}

      <TemplateModal isOpen={isModalOpen} closeModal={closeModal} templates={templates} handleSendTemplate={handleSendTemplate}/>

     { showModal && 
      <AddVariableModal
       show={showModal}
       handleClose={handleModalClose} 
       templateData={TemplateData} 
       setTemplateData={setTemplateData}
       variableValues={variableValues}
       setVariableValues={setVariableValues}
       SendVariableTemplate={SendVariableTemplate}
       />

     }
    </div>
  );
};

export default ChatInput;
