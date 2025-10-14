import { Typography, IconButton } from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait";

const CustomUploadImage = ({ label, required = false, selectedFile, handleFileChange }) => {
  const imagePreview = selectedFile ? URL.createObjectURL(selectedFile) : null;

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="subtitle2">
        {label}
        {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
      </Typography>

      <input
        type="file"
        id="file-upload"
  accept=".jpg,.jpeg"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <label htmlFor="file-upload">
        <IconButton
          component="span"
          disableRipple
          disableFocusRipple
          sx={{ padding: 0 }}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid",
                borderColor:"primary.main"
              }}
            />
          ) : (
            <PortraitIcon
              sx={{
                color: "#FFFFFF",
                backgroundColor: "primary.main",
                width: 100,
                height: 100,
                padding: 2,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            />
          )}
        </IconButton>
      </label>

      {/*{selectedFile && (*/}
      {/*  <Typography variant="body1" sx={{ marginTop: 1, fontSize:"10pt" }}>*/}
      {/*    Archivo seleccionado: {selectedFile.name}*/}
      {/*  </Typography>*/}
      {/*)}*/}
    </div>
  );
};

export default CustomUploadImage;

