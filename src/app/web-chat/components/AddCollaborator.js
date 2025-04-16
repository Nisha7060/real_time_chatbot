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
import { UPDATE_COLLABORATOR } from '@/utils/api';


const AddColloboratorModal = ({lead_id, allCollaborator, open, setOpen,collaborator_ids,fetchAllChatLists,agent_id,fetchChatMessages }) => {
  const [selectedCollaborator, setSelectedCollaborator] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submit status

  // Convert the comma-separated collaborator_ids string to an array of tag IDs
  useEffect(() => {
    if (collaborator_ids) {
      const initialSelectedTags = collaborator_ids.split(',').map((id) => id.trim());
      setSelectedCollaborator(initialSelectedTags);
    }
  }, [collaborator_ids]);
  console.log("collaborator_ids",collaborator_ids);
  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handle toggling tag selection
  const handleToggleCollab = (collabId) => {
    const currentIndex = selectedCollaborator.indexOf(collabId);
    const newChecked = [...selectedCollaborator];

    if (currentIndex === -1) {
      newChecked.push(collabId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedCollaborator(newChecked);
  };

  // Filter tags based on search input
  const filteredCollaborator = allCollaborator.filter((Collaborator) =>
    Collaborator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Handle the Apply button click (send selected tags to API)
  const handleApply = async () => {

    try {
      setIsSubmitting(true); // Disable the submit button
      let data = {lead_id:lead_id ,agent_id:selectedCollaborator};
      let options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Authorization": `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json"
        },
      };
      let response = await fetch(UPDATE_COLLABORATOR, options);
      const res = await response.json();

      if (response.ok) {
          toast.success(res.message);
          setTimeout(() => {
            fetchAllChatLists(lead_id);
            fetchChatMessages(lead_id);
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
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth  style={{padding:"20px"}}>
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
            <b>Add  Collaborator</b>
          </Typography>
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
            {filteredCollaborator.length > 0 ? (
              filteredCollaborator.map((collaborator) => (
                <ListItem key={collaborator.id} sx={{ padding: 0 }}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedCollaborator.includes(collaborator.id.toString())} // Check if tag is selected
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleToggleCollab(collaborator.id.toString())} // Handle tag selection by id
                      disabled={collaborator.id == agent_id} // Prevents unchecking agent_id
                    />
                  </ListItemIcon>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      // backgroundColor: tag.color,
                      borderRadius: '50%',
                      marginRight: 0,
                    }}
                  />
                  <ListItemText
                    primary={collaborator.name}
                    sx={{ fontSize: '0.9rem' }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No Collaborator found" sx={{ fontSize: '0.9rem' }} />
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
            disabled={isSubmitting}
          >
           {isSubmitting ? 'Applying...' : 'Apply'} 
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AddColloboratorModal;
