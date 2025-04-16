import React, { useState } from 'react';
import './templateModal.css';
import { FiSearch, FiSend, FiX } from 'react-icons/fi';
import TemplateCard from './TemplateCard';

const TemplateModal = ({ isOpen, closeModal, templates ,handleSendTemplate}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Toggle search input visibility
  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
    setSearchQuery('');
  };

  // Filter templates based on search and status
  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = template?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || template.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={closeModal}></div>
      <div className="tem-modal-content">
        <div className="box modal-box">
          
          {/* Header Section */}
          <div className="modal-header" style={{margin:"0%"}}>
            {!isSearchVisible ? (
              <>
                <h6 className="title">Templates</h6>
                <div className="modal-actions">
                  <FiSearch className="search-icon text-success" onClick={handleSearchClick} />
                  {/* <button className="new-template-btn">New Template</button> */}
                </div>
              </>
            ) : (
              <div className="search-section">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <FiX className="close-icon" onClick={handleCloseSearch} />
                </div>
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="filter-section">
            <h6>Template Status</h6>
            <select
              className="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Template List with Scroll */}
          <div className="template-list">
            {filteredTemplates?.length > 0 ? (
              filteredTemplates?.map((template) => (
                <TemplateCard key={template.id} template={template} handleSendTemplate={handleSendTemplate} />
              ))
            ) : (
              <p style={{marginLeft:"110px",marginTop:"50px"}}>No templates found</p>
            )}
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
    </div>
  );
};

export default TemplateModal;
