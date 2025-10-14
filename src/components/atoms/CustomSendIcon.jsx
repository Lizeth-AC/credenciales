import { IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const CustomSendIcon = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: 'primary.main',
        color: '#FFFFFF', 
        borderRadius: '10px',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        transition: '0.3s',
        '&:hover': {
          backgroundColor: '#FBCC00',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
      }}
    >
      <SendIcon />
      <Typography>
        Enviar
      </Typography>
    </IconButton>
  );
};

export default CustomSendIcon;
