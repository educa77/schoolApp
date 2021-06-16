import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useFormik, useFormikContext } from "formik";
import { DatePicker } from "@material-ui/pickers";

function DialogAdd({ create, openAdd, handleAddClose, columnas }) {
  console.log("estoy en dialog add");
  const formik = useFormik(create);

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit();
    handleAddClose();
  };

  return (
    <Dialog
      open={openAdd}
      onClose={handleAddClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Agregar</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Por favor, introduzca los datos correspondientes.
        </DialogContentText>
        {create.inputs &&
          create.inputs.map((input) => (
            <Field
              key={input.key}
              input={{
                ...input,
                value: formik.values[input.key],
                handleChange: formik.handleChange,
                setFieldValue: formik.setFieldValue,
              }}
            />
          ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleAddClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} type="submit" color="primary">
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Field({ input }) {
  const { type, key, label, value, handleChange, setFieldValue } = input;
  switch (type) {
    case "date":
      return (
        <DatePicker
          name={key}
          value={value}
          onChange={(value) => setFieldValue(key, value)}
          format="dd/MM/yyyy"
          inputVariant="outlined"
          label={label}
          variant="dialog"
          fullWidth
          margin="normal"
        />
      );
    default:
      return (
        <TextField
          label={label}
          type="text"
          fullWidth
          onChange={handleChange}
          name={key}
          value={value}
          variant="outlined"
          margin="normal"
        />
      );
  }
}

export default DialogAdd;
