import { useField } from 'formik';
import { FormControl, InputLabel, MenuItem, Select, FormHelperText, Typography } from '@mui/material';

const CustomSelect = ({ label, options = [], required = false, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  // Aseguramos que el valor actual exista en las opciones
  const currentValue = options.some(opt => opt.value === field.value)
    ? field.value
    : '';

  const handleChange = (event) => {
    const value = event.target.value;
    helpers.setValue(value);
  };

  return (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <Typography variant="subtitle2">
        {label}
        {required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
      </Typography>
      <Select
        size="small"
        value={currentValue}
        onChange={handleChange}
        sx={{ fontSize: '10pt', minHeight: '40px', height: 'auto' }}
      >
        {options.length === 0 && (
          <MenuItem value="" disabled>
            Cargando...
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '8pt' }}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;