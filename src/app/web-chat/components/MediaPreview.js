import React, { useState } from 'react';
import { FaPlus, FaTrash, FaTimes ,FaFilePdf, FaFileWord, FaFileAlt, FaMusic} from 'react-icons/fa';

import './MediaPreview.css';

const MediaPreview = ({ selectedFiles, handleRemoveMedia, handleAddMedia, handleClosePreview ,handleSendMessage}) => {
  const [currentPreview, setCurrentPreview] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  const handleClickSendMessage = async () => {
    setIsLoading(true);

    await handleSendMessage();
    
    setIsLoading(false);
  };


  return (
    <div className="media-preview-overlay">
  {/* Close Button */}
  <button className="close-preview-btn" onClick={handleClosePreview}>
    <FaTimes />
  </button>

  {/* Full View of Selected File */}
<div className="media-full-view">
  {selectedFiles[currentPreview].type.startsWith('image/') ? (
    <img src={selectedFiles[currentPreview].url} alt="Preview" className="full-preview-image" />
  ) : selectedFiles[currentPreview].type.startsWith('video/') ? (
    <video controls className="full-preview-video">
      <source src={selectedFiles[currentPreview].url} type={selectedFiles[currentPreview].type} />
      Your browser does not support the video tag.
    </video>
  ) : selectedFiles[currentPreview].type.startsWith('audio/') ? (
    <audio controls className="full-preview-audio">
      <source src={selectedFiles[currentPreview].url} type={selectedFiles[currentPreview].type} />
      Your browser does not support the audio tag.
    </audio>
  ) : selectedFiles[currentPreview].type === 'application/pdf' ? (
    <iframe
      src={selectedFiles[currentPreview].url}
      title="PDF Preview"
      className="full-preview-pdf"
      frameBorder="0"
      width="100%"
      height="100%"
    ></iframe>
  ) : selectedFiles[currentPreview].type === 'application/msword' ||
    selectedFiles[currentPreview].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
    <iframe
      src={`https://docs.google.com/gview?url=${selectedFiles[currentPreview].url}&embedded=true`}
      title="Document Preview"
      className="full-preview-doc"
      frameBorder="0"
      scrolling="auto"
      width="100%"
      height="100%"
    ></iframe>
  ) : selectedFiles[currentPreview].type === 'application/vnd.ms-excel' ||
    selectedFiles[currentPreview].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
    <iframe
      src={`https://docs.google.com/gview?url=${selectedFiles[currentPreview].url}&embedded=true`}
      title="Excel Preview"
      className="full-preview-excel"
      frameBorder="0"
      scrolling="auto"
      width="100%"
      height="100%"
    ></iframe>
  ) : selectedFiles[currentPreview].type === 'text/plain' ? (
    <iframe
      src={`data:text/plain;charset=utf-8;base64,${btoa(selectedFiles[currentPreview].url)}`}
      title="Text File Preview"
      className="full-preview-text"
      frameBorder="0"
      width="100%"
      height="100%"
    ></iframe>
  ) : (
    <p>Unsupported file type for preview</p>
  )}
</div>


      {/* Caption Input */}
      <input type="text" placeholder="Add a caption" className="caption-input" />

      <div className="media-all-row">
         <div className="media-thumbnails-row">
           {selectedFiles.map((file, index) => (
             <div key={index} className="media-thumbnail-container">
               {/* Thumbnail based on file type */}
               {file.type.startsWith('image/') ? (
                 <img
                   src={file.url}
                   alt="Image Thumbnail"
                   className="media-thumbnail"
                   onClick={() => setCurrentPreview(index)}
                 />
               ) : file.type.startsWith('video/') ? (
                 <video className="media-thumbnail" onClick={() => setCurrentPreview(index)}>
                   <source src={file.url} type={file.type} />
                 </video>
               ) : file.type.startsWith('audio/') ? (
                 <div className="media-thumbnail" onClick={() => setCurrentPreview(index)}>
                   <FaMusic color='white' /> {/* Audio file icon */}
                   <p>Audio</p>
                 </div>
               ) : file.type === 'application/pdf' ? (
                 <div className="media-thumbnail" onClick={() => setCurrentPreview(index)}>
                   <FaFilePdf color='white' height={"100%"} width={"100%"}  /> {/* PDF icon */}
                 </div>
               ) : file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                 <div className="media-thumbnail" onClick={() => setCurrentPreview(index)}>
                   <FaFileWord color='white' /> {/* Word document icon */}
                   <p>DOC</p>
                 </div>
               ) : (
                 <div className="media-thumbnail" onClick={() => setCurrentPreview(index)}>
                   <FaFileAlt color='white' /> {/* Generic file icon */}
                   <p>{file.type.split('/')[1].toUpperCase()}</p> {/* Display file extension */}
                 </div>
               )}

               {/* Remove button (prevent event propagation) */}
               <button
                 className="remove-thumbnail-btn"
                 onClick={(e) => {
                   e.stopPropagation(); // Prevent triggering the thumbnail click event
                   handleRemoveMedia(index);
                 }}
               >
                 <FaTrash />
               </button>
             </div>
           ))}
         </div>


        
        <div className="media-send-button-row">
          {/* Add More Files Button */}
          <div className="media-thumbnail-add">
            <button onClick={handleAddMedia} className="add-more-btn">
              <FaPlus color='white'/>
            </button>
          </div>
          <div className="media-thumbnail-add1">
      <div
        className="x1247r65 xng8ra"
        tabIndex="-1"
        onClick={!isLoading ? handleClickSendMessage : null}
      >
        <div className="x1n2onr6">
          <div
            aria-disabled={isLoading}
            role="button"
            tabIndex="0"
            aria-label="Send"
            className={`x78zum5 x6s0dn4 xl56j7k xexx8yu x4uap5 x18d9i69 xkhd6sd x1f6kntn xk50ysn x7o08j2 xtvhhri x1rluvsa x14yjl9h xudhj91 x18nykt9 xww2gxu xu306ak x12s1jxh xkdsq27 xwwtwea x1gfkgh9 x1247r65 xng8ra ${isLoading ? 'disabled' : ''}`}
          >
            {isLoading ? (
              // Loading icon (you can customize this SVG or use any other spinner component)
              <span aria-hidden="true" data-icon="loading" className="xsgj6o6">
                <svg viewBox="0 0 24 24" height="24" width="24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="60"
                    strokeDashoffset="0"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;60"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </span>
            ) : (
              // Send icon
              <span aria-hidden="true" data-icon="send" className="xsgj6o6">
                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet">
                  <title>send</title>
                  <path
                    fill="currentColor"
                    d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"
                  ></path>
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
        </div>
      </div>
     </div>
  );
};

export default MediaPreview;
