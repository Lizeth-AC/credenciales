import { useState } from "react";
import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LateralMenuItem = ({ titulo, subItems = [] }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => setOpen(!open);

  const handleClickSubItem = (path) => {
    navigate(path);
  };

  return (
    <>
      <ListItemButton
        onClick={toggleOpen}
        sx={{
          '& .MuiListItemText-primary': { fontWeight: 'bold', fontSize: 15 },
          '&:hover .MuiListItemText-primary': { color: 'primary.main' },
          borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)', // Sombra botón
              m: 1,
        }}
      >
        <ListItemText primary={titulo} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit >
        <List component="div" disablePadding >
          {subItems.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{ pl: 4, '&:hover .MuiListItemText-primary': {
              color: 'primary.main',
              } }}
              onClick={() => handleClickSubItem(item.path)}
            >
              <ListItemText primary={item.label}/>
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default LateralMenuItem;
