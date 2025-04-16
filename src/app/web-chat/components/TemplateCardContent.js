import React from 'react';
import { FaPhone, FaLink } from 'react-icons/fa';
import './TemplateCardContent.css'; // Include your CSS file for styles
import dayjs from "dayjs";
import '@fortawesome/fontawesome-free/css/all.min.css';

const TemplateCardContent = ({ template,bgcolor="white" ,sendtime ,ticks,msg,senderColor}) => {
  // Function to determine and render media (image, video, audio, pdf)
  const renderMedia = () => {
    if (template.image_url) {
      return <img src={template.image_url} alt="Template Media" className="media-content" />;
    } else if (template.video_url) {
      return (
        <video controls className="media-content">
          <source src={template.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (template.pdf_url) {

      return (
        <div className="pdf-container">
      {/* PDF Icon */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/4726/4726010.png" // Replace with the path to your image
        alt="PDF Icon"
        className="pdf-icon"
      />

      {/* PDF Name */}
      <div className="pdf-info">
        <span className="pdf-title text-sm">{template.pdf_url.split('/').pop()}</span>

        {/* Download Icon */}
        <a href={template.pdf_url} download>
          <img
            src="https://www.citypng.com/public/uploads/preview/flat-circle-round-black-download-button-icon-png-701751694965581mo9ijskhxp.png" // Replace with the path to your image
            alt="Download Icon"
            className="download-icon1"
          />
        </a>
      </div>
    </div>

      );
    } else if (template.audio_url !== "NA") {
      return (
        <audio controls className="media-content">
          <source src={template.audio_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    }
    return null;
  };

  const formatTime = (time) => {
    const messageDate = dayjs(time);
    const today = dayjs().startOf('day');
    if (messageDate.isAfter(today)) {
      return messageDate.format("HH:mm");
    }
    return messageDate.format("YYYY-MM-DD");
  };

  return (
<div className="template-card" style={sendtime ? { backgroundColor: bgcolor,borderRadius:"20px 8px 20px 20px" } : {}}>
{/* Media Content */}


          {msg?.type === 'Outgoing' && msg.sent_by && (
                 <div
                   className="sender-name"
                   style={{
                     fontWeight: 'bold',
                     textAlign: 'left',
                     marginLeft: '10px',
                     marginTop: '5px',
                     color: senderColor,
                   }}
                 >
                   {msg.sent_by}
                 </div>
               )}

      {renderMedia() && <div className="template-media">{renderMedia()}</div>}

      {/* Template Content */}
      <div className="template-content">
        {/* Template Header */}
        {template.header_text && template.header_type.toUpperCase() === "TEXT" && (
          <div className="template-header">
            {template.header_text}
          </div>
        )}

        {/* Template Body */}
        {template.body_text && (
          <div className="template-body">
            <p>{template.body_text}</p>
          </div>
        )}

        {/* Template Footer */}
        {template.footer_text && (
          <div className="template-footer">
            <span>{template.footer_text}</span>
          </div>
        )}
       {/* Created At */}
       {!sendtime && <span className="created-at">{formatTime(template.created_at)}</span> ||  <span className="created-at">{sendtime} {ticks}</span> }
      </div>
      {/* WhatsApp Template Buttons */}
      {template.buttons?.length > 0 && (
        <div className="template-buttons">
          {template.buttons.map((button, index) => (
            <a
              key={index}
              className="whatsapp-button"
              href={
                button.type === 'PHONE_NUMBER'
                  ? `tel:${button.phone_number}`
                  : button.type === 'URL'
                  ? button.url.startsWith('http')
                    ? button.url
                    : `http://${button.url}`
                  : '#'
              }
              target={button.type === 'URL' ? "_blank" : undefined}
              rel={button.type === 'URL' ? "noopener noreferrer" : undefined}
            >
              {button.type === 'PHONE_NUMBER' && <FaPhone />} {/* Phone Icon */}
              {button.type === 'URL' && <FaLink />} {/* URL Icon */}
              {button.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateCardContent;
