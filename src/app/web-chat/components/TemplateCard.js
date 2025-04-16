import React from 'react';
import { FiSend } from 'react-icons/fi';
import './templateCard.css'; // Assuming a separate CSS file for card styles
import TemplateCardContent from './TemplateCardContent'; // Import the new component

const TemplateCard = ({ template ,handleSendTemplate }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'yellowgreen';
    }
  };

  return (
    <div className="template-card-modal">
      {/* Category and Name */}
      <h6 className="category-text">{template.category}</h6>
      <div className="template-header-info">
        <b>{template.name}</b>
        <span className="template-language">{template.language}</span>
      </div>

      {/* Content Section */}
      <div className="template-card-content">
        {/* Use the new TemplateCardContent component */}
        <TemplateCardContent template={template} />

        {/* Send Button */}
        <div className="send-btn-container">
        <button className="send-btn" onClick={() => handleSendTemplate(template.id)}>
        <FiSend />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="template-status" style={{ color: getStatusColor(template.status) }}>
        {template.status}
      </div>
      <hr />
    </div>
  );
};

export default TemplateCard;
