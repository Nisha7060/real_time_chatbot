import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Fade,
  Backdrop,
  InputAdornment,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { START_NEW_CHAT } from '@/utils/api';

const SidebarForm = ({ open, onClose, fetchAllChatLists, fetchChatMessages }) => {
  const [contactOptions, setContactOptions] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mobile, setMobile] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactError, setContactError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const result = await fetch("/api/getUserList", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await result.json();
      if (result.ok && data?.data) {
        setContactOptions(data.data);
      } else {
        throw new Error(data?.message || "Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error.message);
      setContactError("Failed to load contacts");
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open]);

  const handleContactChange = (event, newValue) => {
    setSelectedContact(newValue);
    setContactError('');
    if (newValue?.mobile) {
      setMobile(newValue.mobile);
    } else {
      setMobile('');
    }
  };

  const handleStartChat = async () => {
    if (!selectedContact || !selectedContact.id) {
      setContactError("Please select a contact.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: selectedContact.id,
      };

      const result = await fetch("/api/createChatContact", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const res = await result.json();

      if (result.ok) {
        toast.success(res.message || "Chat started");
        fetchAllChatLists(res.data.id);
        fetchChatMessages(res.data.id);
        handleClose();
      } else {
        toast.error(res?.error || res?.message || "Failed to start chat");
      }
    } catch (error) {
      console.error("Start chat error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedContact(null);
    setMobile('');
    setContactError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#fff',
            boxShadow: 24,
            p: 4,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChatIcon />
            Start Chat
          </Typography>

          <Autocomplete
            options={contactOptions}
            getOptionLabel={(option) => option.name || ''}
            loading={loadingContacts}
            value={selectedContact}
            onChange={handleContactChange}
            noOptionsText={contactError || 'No contacts found'}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                {option.name && option.mobile
                  ? `${option.name} (${option.mobile})`
                  : option.name || option.mobile}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select User"
                placeholder="Select User for chat"
                error={!!contactError}
                helperText={contactError}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <PersonIcon sx={{ mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {loadingContacts ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            label="Customer Mobile"
            value={mobile}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleStartChat}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Starting...' : 'Start'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SidebarForm;
