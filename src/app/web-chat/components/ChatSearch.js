import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the datepicker styles
import './ChatWindow.css';

const ChatSearch = ({ onBackClick, contactName, onSearch, onDateChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date); // This will trigger search by date
    setShowCalendar(false); // Close calendar after selecting date
  };

  return (
    <div className="search-header">
      {/* Back Button */}
      <button className="back-button" onClick={onBackClick}>
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </button>

      {/* Search Input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search for messages within ${contactName}`}
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-search" onClick={handleClearSearch}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        )}
      </div>

      {/* Calendar Icon */}
      <button className="calendar-icon" onClick={handleCalendarToggle}>
        <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
      </button>

      {/* Calendar Picker */}
      {showCalendar && (
        <div className="calendar-container">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="Select a date"
            inline
          />
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
