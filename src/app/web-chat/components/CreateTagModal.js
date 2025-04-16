import React, { useState } from 'react';
import './CreateTagModal.css'; // Custom CSS for the modal
import { CREATE_WAB_TAGS } from '@/utils/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const CreateTagModal = ({ open, handleClose }) => {
  const [tagName, setTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submit status

  const onSubmit = async () => {
    if (tagName.trim()) {
        try {
            setIsSubmitting(true); // Disable the submit button
            let data = { tag_name:tagName};
            let options = {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Authorization": `Bearer ${Cookies.get("token")}`,
                "Content-Type": "application/json"
              },
            };
            let response = await fetch(CREATE_WAB_TAGS, options);
            const res = await response.json();

            if (response.ok) {
                toast.success(res.message);
                setTagName("");
                handleClose();         // Close the modal after submission
            }else{
                toast.error(res.error);
                toast.error(res?.message);
            }
          } catch (error) {
            console.error("Error fetching chat messages:", error);
            toast.error(error);
          }
          setIsSubmitting(false); // Disable the submit button
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h6>Create New Tag</h6>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Enter tag name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="input-field"
            autoFocus
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="submit-button"
            onClick={onSubmit}
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? 'Submitting...' : 'Submit'} {/* Change text while submitting */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTagModal;
