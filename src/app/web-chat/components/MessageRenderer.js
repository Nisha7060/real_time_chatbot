import { useState ,useMemo} from 'react';
import Image from 'next/image';
import { format } from 'date-fns'; // Importing date-fns for date formatting
import './MessageRenderer.css'; // Import custom CSS for styling
import TemplateCardContent from './TemplateCardContent'; // Import the new component
import { AiOutlineDownload } from 'react-icons/ai'; // For download icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload } from '@fortawesome/free-solid-svg-icons'; // Update icon to faFilePdf for PDFs

const MessageRenderer = ({ msg, isOutgoing }) => {
  const messageClass = isOutgoing ? 'outgoing-message' : 'incoming-message';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');


  // Function to handle showing the modal
  const handleIconClick = (reso) => {
    setReason(reso);
    setShowModal(true);
  };

  // Function to handle closing the modal
  const closeFailedModal = () => {
    setShowModal(false);
  };



  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDownload = (imageSrc) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'downloaded-image.jpg'; // You can change this filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (dateString) => {
    let date;
  
    // Check if the input is already a Date object, otherwise try to parse it
    if (dateString instanceof Date) {
      date = dateString;
    } else {
      date = new Date(dateString);
    }
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    // Return the formatted time
    return format(date, 'h:mm a'); // Example: '10:20 AM'
  };

  const extractFileNameFromUrl = (url) => {
    return url.split('/').pop();
  };
  
  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const isToday = format(now, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    const isYesterday = format(now.setDate(now.getDate() - 1), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return format(date, 'MMMM d, yyyy'); // Formats to something like September 25, 2024
  };

  // Function to generate a color based on a string
const generateColor = (name) => {
  const colors = ['#ff5733', '#33c9ff', '#8bc34a', '#ffc107', '#e91e63','#624fd9'];
  let hash = 0;
  for (let i = 0; i < name?.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

  const senderColor = useMemo(() => generateColor(msg.sent_by), [msg.sent_by]);


  const renderTicks = (status,failed_reason="NA") => {
    switch (status) {
      case 'sent':
        return (
          <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg sent">
            <title>msg-check-sent</title>
            <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25Z" fill="currentColor"/>
          </svg>
        ); // Single tick icon for "sent"
      
      case 'recieved':
        return (
          <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg delivered">
            <title>msg-dblcheck-delivered</title>
            <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25ZM7.75 8.25L4.75 5.25L3.75 6.25L7.75 10.25L15.25 2.75L14.25 1.75L7.75 8.25Z" fill="currentColor"/>
          </svg>
        ); // Double gray tick for "delivered"
      case 'delivered':
          return (
            <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg delivered">
              <title>msg-dblcheck-delivered</title>
              <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25ZM7.75 8.25L4.75 5.25L3.75 6.25L7.75 10.25L15.25 2.75L14.25 1.75L7.75 8.25Z" fill="currentColor"/>
            </svg>
          ); // Double gray tick for "delivered"
      case 'read':
        return (
          <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg read">
            <title>msg-dblcheck-read</title>
            <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25ZM7.75 8.25L4.75 5.25L3.75 6.25L7.75 10.25L15.25 2.75L14.25 1.75L7.75 8.25Z" fill="#34B7F1"/> {/* Blue tick */}
          </svg>
        ); // Double blue tick for "read"
  
      case "failed":
          return (
            <span onClick={() => handleIconClick(failed_reason)} style={{ cursor: 'pointer' }}>
            <svg viewBox="0 0 16 16" height="15" width="15" fill="none" className="tick-svg failed mb-2">
              <title>msg-failed</title>
              <circle cx="8" cy="8" r="7" stroke="#FF3B30" strokeWidth="2" fill="none" />
              <line x1="8" y1="4" x2="8" y2="8" stroke="#FF3B30" strokeWidth="2" />
              <circle cx="8" cy="11" r="1" fill="#FF3B30" />
            </svg>

           {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay1"
          onClick={closeModal} // Close modal when clicking on the overlay
        >
          <div
            className="modal-content1"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="modal-header1">
            <h5 className='mb-0'>
            <svg viewBox="0 0 16 16" height="18" width="18" fill="none" className="tick-svg failed mr-3">
              <title>msg-failed</title>
              <circle cx="8" cy="8" r="7" stroke="#FF3B30" strokeWidth="2" fill="none" />
              <line x1="8" y1="4" x2="8" y2="8" stroke="#FF3B30" strokeWidth="2" />
              <circle cx="8" cy="11" r="1" fill="#FF3B30" />
            </svg>
            <span style={{"margin-left": "17px"}}>Error Details</span>
            </h5>
              {/* Close Icon */}
              <svg
                onClick={closeFailedModal}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                height="24"
                width="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="close-icon"
                style={{ cursor: 'pointer',top:"23%" }}
              >

                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <hr/>

            </div>
            <hr></hr>
            <div className='failed-msg1'>
             <h6 style={{fontSize:"0.89rem",color: "black"}}>{reason}</h6> 
              </div>

          </div>
        </div>
      )}
    </span>
          ); // Red exclamation mark for "failed"
      default:
        return null;
    }
  };
  

  if (msg.type === 'system_specific') {
    return (
      <div className="system-message">
        <p>{msg.msg}</p>
      </div>
    );
  }

  switch (msg.msg_type) {
    case 'text':
      return (
        <div className={`${messageClass} message-bubble`}>
              {/* Display the sender's name with dynamic color */}
               {msg.type === 'Outgoing' && msg.sent_by && (
                 <div
                   className="sender-name"
                   style={{
                     fontWeight: 'bold',
                     textAlign: 'left',
                     marginLeft: '5px',
                     marginRight: '5px',
                     color: senderColor,
                   }}
                 >
                   {msg.sent_by}
                 </div>
               )}

          <p>{msg.msg}</p>
          <span className="message-time">                                                        
            {formatTime(msg.created_at)} {msg.type === 'Outgoing' && renderTicks(msg.status,msg?.failed_reason)}
          </span>
        </div>
      );
      
    case 'image':
      return (
        <>
      {/* Message Bubble */}
      <div className={`${messageClass} message-bubble`} style={{ position: 'relative', padding: '5px 5px 25px' }}>
        {/* Display the sender's name with dynamic color */}
        {msg.type === 'Outgoing' && msg.sent_by && (
                 <div
                   className="sender-name"
                   style={{
                     fontWeight: 'bold',
                     textAlign: 'left',
                     marginLeft: '5px',
                     color: senderColor,
                   }}
                 >
                   {msg.sent_by}
                 </div>
               )}

        <div className="image-container">
          <Image
            src={msg.msg}
            alt="Image"
            width={200}
            height={150}
            className="chat-image"
            onClick={openModal} // Open modal on image click
            style={{ cursor: 'pointer', borderRadius: '8px' }} // Show a pointer to indicate clickability
          />
          {/* Download Icon, shown on hover */}
          <AiOutlineDownload
            className="download-icon"
            onClick={() => handleDownload(msg.msg)}
            size={24}
          />
        </div>
        <span className="message-time">
          {formatTime(msg.created_at)}  {msg.type === 'Outgoing' && renderTicks(msg.status,msg?.failed_reason)}
        </span>
      </div>

      {/* Modal for Image Expanding */}
      {isModalOpen && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>×</span>
            <img src={msg.msg} alt="Expanded view" className="expanded-image" />
          </div>
        </div>
      )}
    </>
      );

    case 'video':
      return (
        <div className={`${messageClass} message-bubble`}>
          {/* Display the sender's name with dynamic color */}
          {msg.type === 'Outgoing' && msg.sent_by && (
                 <div
                   className="sender-name"
                   style={{
                     fontWeight: 'bold',
                     textAlign: 'left',
                     marginLeft: '5px',
                     color: senderColor,
                   }}
                 >
                   {msg.sent_by}
                 </div>
               )}

          <video controls width="200" className="chat-video">
            <source src={msg.msg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <span className="message-time">
            {formatTime(msg.created_at)}  {msg.type === 'Outgoing' && renderTicks(msg.status,msg?.failed_reason)}
          </span>
        </div>
      );

    case 'audio':
      return (
        <div className={`${messageClass} message-bubble`}>
          {/* <div className="file-info">
                  <span className="file-name">{msg.file_name}</span>
                  <span className="file-size">{msg.file_size}</span>
          </div> */}
          {/* Display the sender's name with dynamic color */}
          {msg.type === 'Outgoing' && msg.sent_by && (
                 <div
                   className="sender-name"
                   style={{
                     fontWeight: 'bold',
                     textAlign: 'left',
                     marginLeft: '5px',
                     color: senderColor,
                   }}
                 >
                   {msg.sent_by}
                 </div>
               )}
          <audio controls className="chat-audio" style={{ minWidth: '200px' }}>
            <source src={msg.msg} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          
          <span className="message-time">
            {formatTime(msg.created_at)}  {msg.type === 'Outgoing' && renderTicks(msg.status,msg?.failed_reason)}
          </span>
        </div>
      );

      case 'document':
        return (
          <div className={`${messageClass} message-bubble document-message`} onClick={() => window.open(msg.msg, '_blank')}>
            {/* Display the sender's name with dynamic color */}
            {msg.type === 'Outgoing' && msg.sent_by && (
                 <div
                   className="sender-name"
                   style={{
                     fontWeight: 'bold',
                     textAlign: 'left',
                     marginLeft: '5px',
                     color: senderColor,
                   }}
                 >
                   {msg.sent_by}
                 </div>
               )}

              <div className="document-container">
                <div className="file-details">
                  <FontAwesomeIcon icon={faFilePdf} className="document-icon" />
                  <div className="file-info">
                    <span className="file-name">{extractFileNameFromUrl(msg.msg)}</span>
                  </div>
                </div>
              </div>
              <span className="message-time">
                {formatTime(msg.created_at)} {msg.type === 'Outgoing' && renderTicks(msg.status,msg?.failed_reason)}
              </span>
         </div>
        );

    case 'template':
      return (
        <TemplateCardContent 
          template={msg?.msg_type_desc || JSON.parse(msg?.type_desc)} 
          bgcolor={"#dcf8c6"} 
          sendtime={formatTime(msg.created_at)}  
          ticks={msg.type === 'Outgoing' ? renderTicks(msg.status,msg?.failed_reason) : null}
          msg={msg}
          senderColor={senderColor}
        />
      );
    default:
      return (
        <div className={`${messageClass} message-bubble`}>
              {/* Display the sender's name with dynamic color */}
               {msg.type === 'Outgoing' && msg.sent_by && (
                 <div
                   className="sender-name"
                   style={{
                     fontWeight: 'bold',
                     textAlign: 'left',
                     marginLeft: '5px',
                     marginRight: '5px',
                     color: senderColor,
                   }}
                 >
                   {msg.sent_by}
                 </div>
               )}

          <p>{msg.msg}</p>
          <span className="message-time">
            {formatTime(msg.created_at)} {msg.type === 'Outgoing' && renderTicks(msg.status,msg?.failed_reason)}
          </span>
        </div>
      );
  }
};

export default MessageRenderer;
