import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai"; // Icon for close button
import "./CollaboratorSidebar.css";
import { GET_COLLABORATOR } from "@/utils/api";
import Cookies from "js-cookie";

const CollaboratorSidebar = ({ lead_id, isOpen, onClose }) => {
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen]);

  const fetchCollaborators = async () => {
    try {
      let options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lead_id }),
      };
      let response = await fetch(GET_COLLABORATOR, options);

      if (response.ok) {
        const data = await response.json();
        setCollaborators(data.data);
      } else {
        console.error("Error fetching collaborators:", response.status);
      }
    } catch (error) {
      console.error("Error fetching collaborators:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Collaborator Info</h3>
        <button className="close-btn" onClick={onClose}>
          <AiOutlineClose />
        </button>
      </div>

      <div className="collaborator-header">Collaborator Member</div>

      <ul className="collaborator-list">
        {collaborators.map((collaborator) => (
          <li key={collaborator.id} className="collaborator-item">
            <div className="collaborator-image">
              {/* Show first letter of the name if no profile image */}
              {collaborator.profileImage ? (
                <img
                  src={collaborator.profileImage}
                  alt={collaborator.name}
                  className="collaborator-image"
                />
              ) : (
                collaborator.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="collaborator-name">{collaborator.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollaboratorSidebar;
