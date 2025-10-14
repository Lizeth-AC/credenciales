import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const CustomDeleteIcon = ({onClick}) => {
  return (
    <IconButton size="small" sx={{color: 'red',
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        }
      }}
      onClick={onClick}
    >
      <DeleteIcon />
    </IconButton>
  );
}

export default CustomDeleteIcon;