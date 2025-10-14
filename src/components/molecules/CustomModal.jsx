import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Formik, Form } from "formik";
import CustomTextField from "../atoms/CustomTextField";
import CustomSelect from "../atoms/CustomSelect";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CustomModal = ({ title, fields = [], open, onClose, onSubmit, initialValues = {} }) => {
  const initVals = fields.reduce((acc, field) => {
    acc[field.name] = initialValues[field.name] || "";
    return acc;
  }, {});

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>{title}</Typography>
        <Formik
          initialValues={initVals}
          onSubmit={(values, actions) => {
            onSubmit(values);
            actions.setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {fields.map(({ name, label, required, onlyNumbers, onlyLetters, options }, i) =>
                options ? (
                  <CustomSelect
                    key={i}
                    name={name}
                    label={label}
                    required={required}
                    options={options}
                  />
                ) : (
                  <CustomTextField
                    key={i}
                    name={name}
                    label={label}
                    required={required}
                    onlyNumbers={onlyNumbers}
                    onlyLetters={onlyLetters}
                  />
                )
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Guardar
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CustomModal;
