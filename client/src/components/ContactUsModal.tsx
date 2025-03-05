import { Modal, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useContext } from "react";
import { SnackBarContext } from "../App";
import { PageClassName } from "../theme/AppStyles";
import { send } from "@emailjs/browser";

const DEFAULT_BACKGROUND_COLOUR = "#f0ede8";

type ContactUsModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  pageClassName?: PageClassName;
};

export const ContactUsModal = ({ isOpen, closeModal, pageClassName }: ContactUsModalProps) => {
  const [message, setMessage] = useState("");

  const [toSend, setToSend] = useState({
    from_name: "",
    reply_to: "",
    message: "",
  });

  const serviceID = import.meta.env.VITE_EMAIL_SERVICEID;
  const templateID = import.meta.env.VITE_EMAIL_TEMPLATEID;
  const pubkey = import.meta.env.VITE_EMAIL_PUBKEY;

  const snackBar = useContext(SnackBarContext);

  const onSubmit = (e: any) => {
    e.preventDefault();
    toSend.message = message;
    send(serviceID, templateID, toSend, pubkey)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      })
      .finally(() => {
        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Request sent! We'll be in touch soon!",
          isError: false,
        });
        closeModal();
      });
  };

  const handleChange = (e: any) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <Modal open={isOpen} onClose={closeModal} className={`${pageClassName}`}>
      <Box
        className="contact-us-modal-contents"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          minWidth: "300px",
          maxWidth: "550px",
          border: "none",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          p: 5,
          backgroundColor: DEFAULT_BACKGROUND_COLOUR,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box
            component="h2"
            sx={{
              fontFamily: "Lobster, Arial, sans-serif",
              fontSize: { xs: '2rem', sm: '2.5rem' },
              mb: 2,
              color: '#1a1a1a'
            }}
          >
            Get in Touch
          </Box>
          <Box
            component="p"
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.9rem',
              opacity: 0.7,
              color: '#1a1a1a'
            }}
          >
            We&apos;d love to hear from you
          </Box>
        </Box>

        <form onSubmit={onSubmit}>
          <TextField
            name="from_name"
            placeholder="Your Name"
            value={toSend.from_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2196f3',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2196f3',
                }
              }
            }}
          />
          <TextField
            type="email"
            name="reply_to"
            placeholder="Your Email"
            value={toSend.reply_to}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2196f3',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2196f3',
                }
              }
            }}
          />
          <TextField 
            placeholder="Message" 
            onChange={(e) => setMessage(e.target.value)} 
            multiline 
            rows={4}
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff',
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2196f3',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2196f3',
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: '12px',
              backgroundColor: '#2196f3',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            Send Message
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
