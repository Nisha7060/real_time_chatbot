import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { ASSIGN_WAB_TAGS } from '@/utils/api';


const TagModal = ({lead_id, tags, open, setOpen, setCreateModalOpen, tag_ids ,fetchAllChatLists }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submit status

  console.log("<><><>tag_ids<><><><>",tag_ids);
  // Convert the comma-separated tag_ids string to an array of tag IDs
  useEffect(() => {
    if (tag_ids) {
      const initialSelectedTags = tag_ids.split(',').map((id) => id.trim());
          if (initialSelectedTags && initialSelectedTags != 'NA') {
            setSelectedTags(initialSelectedTags);
          }
      }
  }, [tag_ids]);

  console.log("selectedTags",selectedTags);
  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handle toggling tag selection
  const handleToggleTag = (tagId) => {
    const currentIndex = selectedTags.indexOf(tagId);
    const newChecked = [...selectedTags];

    if (currentIndex === -1) {
      newChecked.push(tagId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedTags(newChecked);
  };

  // Filter tags based on search input
  const filteredTags = tags.filter((tag) =>
    tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle the Apply button click (send selected tags to API)
  const handleApply = async () => {

    try {
      setIsSubmitting(true); // Disable the submit button
      let data = {lead_id:lead_id ,tag_id:selectedTags};
      let options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Authorization": `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json"
        },
      };
      let response = await fetch(ASSIGN_WAB_TAGS, options);
      const res = await response.json();

      if (response.ok) {
          toast.success(res.message);

          setTimeout(() => {
          fetchAllChatLists(lead_id);
          }, 1000);

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
  };

  return (
    <>
      {/* Main Tag Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        {/* Dialog Header */}
        <DialogTitle
          sx={{
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: '500', color: '#333', fontSize: '1rem' }}>
            <b>Add a tag</b>
          </Typography>
          <Button
            startIcon={<AddIcon />}
            sx={{
              color: '#4caf50',
              textTransform: 'none',
              fontWeight: '500',
              fontSize: '0.85rem',
              backgroundColor: '#e8f5e9', // Light green background for better distinction
              padding: '5px 8px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#c8e6c9', // Slightly darker on hover
              },
            }}
            onClick={() => {
              setCreateModalOpen(true);
              handleClose();
            }} // Open the create new tag modal
          >
            Create new tag
          </Button>
        </DialogTitle>

        {/* Tag List */}
        <DialogContent
          dividers
          sx={{
            padding: '12px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search and Create new tag */}
          <Box
            sx={{
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              borderRadius: '12px',
              border: '1px solid #ccc',
            }}
          >
            <SearchIcon sx={{ mr: 1, color: '#757575', fontSize: '1.5rem' }} />
            <TextField
              placeholder="Search or create a tag..."
              variant="standard"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                borderRadius: '15px',
                fontSize: '0.9rem',
                backgroundColor: 'none',
              }}
            />
          </Box>

          <List
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              maxHeight: '300px',
              padding: '1px',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <ListItem key={tag.id} sx={{ paddingLeft: 1 }}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedTags.includes(tag.id.toString())} // Check if tag is selected
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleToggleTag(tag.id.toString())} // Handle tag selection by id
                    />
                  </ListItemIcon>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      backgroundColor: tag.color,
                      borderRadius: '50%',
                      marginRight: 0,
                    }}
                  />
                  <ListItemText
                    primary={tag.tag_name}
                    sx={{ fontSize: '0.9rem' }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No tags found" sx={{ fontSize: '0.9rem' }} />
              </ListItem>
            )}
          </List>
        </DialogContent>

        {/* Bottom Buttons */}
        <Box
          sx={{
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            sx={{ backgroundColor: '#ee3535', color: '#fff', textTransform: 'none', fontSize: '0.85rem' }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4caf50',
              textTransform: 'none',
              color: '#fff',
              fontSize: '0.9rem',
            }}
            onClick={handleApply}
            disabled={isSubmitting} // Disable if no tags selected
          >
           {isSubmitting ? 'Applying...' : 'Apply'} 
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default TagModal;
