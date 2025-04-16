import React from "react";
import TemplateCardContent from './TemplateCardContent'; // Import the new component

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  // Same day, show time in AM/PM format
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  // Within a week, show day of the week
  if (now - date < 7 * oneDay) {
    return date.toLocaleDateString([], { weekday: "long", hour: "2-digit", minute: "2-digit", hour12: true });
  }

  // Otherwise, show date and time
  return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
};

const MessageInfoModal = ({ isOpen, onClose, messageData }) => {
  const { msg, delivered_time, read_time, sent_time, sent_by } = messageData;

  if (!isOpen) return null;

  const renderMessageContent = (msg) => {

    console.log(",.,.,.,.",msg)
    switch (msg.msg_type) {
      case "text":
        return <span>{msg.msg}</span>;

      case "image":
        return (
          <img
            src={msg.msg}
            alt="Message"
            className="img-fluid rounded"
            style={{ maxHeight: "250px" }}

          />
        );

      case "video":
        return (
          <video
            controls
            className="w-100 rounded"
            style={{ maxHeight: "200px" }}
          >
            <source src={msg.msg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      case "document":
        return (
          <a
            href={msg.msg}
            className="btn btn-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-file-earmark-text"></i> Open Document
          </a>
        );

      case "template":
        return (
            <TemplateCardContent template={messageData.msg_type_desc} />
        );

      default:
        return <span>Unsupported message type</span>;
    }
  };





  return (
    <div
      className="modal fade show d-block gap-0"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex="-1"
    >
      <div style={{marginLeft:"30%"}}>
        <div className="modal-content p-0 ">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Message Information</h5>
            {/* <button
              type="button"
              className="btn-close"
              style={{ boxShadow: "none",right:"0",top:"0",marginLeft:"30%" }}
              aria-label="Close"
              onClick={onClose}
              
            ></button> */}
          </div>

          {/* Modal Body */}
          <div className="modal-body msgInfo-body" >
            {/* Message */}
           {/* Message */}
           <div className="mb-2">
              <h6 className="text-muted">Message:</h6>
              <div className="alert alert-light border rounded text-align-center">
                {renderMessageContent(messageData)}
              </div>
            </div>

            {/* Receipt Information */}
            <h6 className="text-muted mb-1">Receipt Information</h6>
            <div className="receipt-info mb-1">
              <span className="fw-bold">Sent by:</span> {sent_by}
            </div>

            <div className="status-info">
              {sent_time && (
                <div className="d-flex align-items-center mb-1">
                  <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg sent">
                    <title>msg-check-sent</title>
                    <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25Z" fill="currentColor"/>
                  </svg>
                  <span>Sent: {formatDateTime(sent_time)}</span>
                </div>
              )}
              {delivered_time && (
                <div className="d-flex align-items-center mb-1">
                  <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg delivered">
                    <title>msg-dblcheck-delivered</title>
                    <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25ZM7.75 8.25L4.75 5.25L3.75 6.25L7.75 10.25L15.25 2.75L14.25 1.75L7.75 8.25Z" fill="currentColor"/>
                  </svg>
                  <span>Delivered: {formatDateTime(delivered_time)}</span>
                </div>
              )}
              {read_time && (
                <div className="d-flex align-items-center">
                  <svg viewBox="0 0 16 11" height="11" width="16" fill="none" className="tick-svg read">
                    <title>msg-dblcheck-read</title>
                    <path d="M4.75 8.25L1.75 5.25L0.75 6.25L4.75 10.25L12.25 2.75L11.25 1.75L4.75 8.25ZM7.75 8.25L4.75 5.25L3.75 6.25L7.75 10.25L15.25 2.75L14.25 1.75L7.75 8.25Z" fill="#34B7F1"/> {/* Blue tick */}
                  </svg>
                  <span>Read: {formatDateTime(read_time)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success float-r"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInfoModal;
