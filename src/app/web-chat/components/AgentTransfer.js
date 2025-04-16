import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { WAB_AGENT_TRANSFER } from '@/utils/api';
import './AgentTransfer.css';  // Import the external CSS file

const AgentTransferModal = ({ lead_id, allAgentList, open, setOpen, agent_id, fetchAllChatLists ,setSelectedChat }) => {
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (agent_id) {
      setSelectedCollaborator(agent_id);
    }
  }, [agent_id]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectCollab = (collabId) => {
    setSelectedCollaborator(collabId.toString()); // Ensure ID is stored as a string
  };

  const filteredCollaborator = allAgentList.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSelectCollab = () => {
    setSelectedCollaborator(""); // Ensure ID is stored as a string
  };

  const handleApply = async () => {
    try {
      setIsSubmitting(true);
      const data = { lead_id, assign_agent: parseInt(selectedCollaborator, 10) };
      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(WAB_AGENT_TRANSFER, options);
      const res = await response.json();

      if (response.ok && res.status === 200) {
        toast.success(res.message);
        setTimeout(() => {
          fetchAllChatLists(lead_id);
          setSelectedChat(null);
          }, 500);
        handleClose();
      } else {
        toast.error(res.error || res.message);
      }
    } catch (error) {
      console.error('Error updating Agent:', error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false); // Always set to false in the end
    }
  };

  return (
    <>
      {open && (
        <div className="modal-overlay">
          <div className="agentmodal-content">
            <div className="modal-header">
              <h2>Agent Transfer</h2>
              <button onClick={handleClose} className="close-button">&times;</button>
            </div>

            <div className="agentlist-body">
                <button onClick={clearSelectCollab} style={{marginLeft:"336px", color:"#f12121f7" ,background:"none" ,border:"none", marginBottom:"7px"}}>clear</button>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search agnet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="agenttrans-list">
                {filteredCollaborator.length > 0 ? (
                  filteredCollaborator.map((collaborator) => (
                    <div key={collaborator.id} className="collaborator-item">
                      <input
                        type="radio"
                        id={`collab-${collaborator.id}`} // Ensure each ID is unique
                        name="selectedCollaborator"
                        value={collaborator.id}
                        checked={selectedCollaborator.toString() === collaborator.id.toString()} // Ensure the comparison is done with the same type
                        onChange={() => handleSelectCollab(collaborator.id.toString())} // Store collaborator ID as a string
                      />
                      <label htmlFor={`collab-${collaborator.id}`}>
                        {collaborator.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No Agent found</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={handleClose} className="cancel-button">
                Cancel
              </button>
              <button
                onClick={handleApply}
                className={`apply-button ${isSubmitting ? 'disabled' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Applying...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentTransferModal;
