import React, { useEffect, useState } from "react";
import { CountryService } from "../services/CountryService";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const schema = Yup.object({
  name: Yup.string().required("Tên không được để trống"),
  code: Yup.string().required("Mã không được để trống"),
  description: Yup.string(),
});

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const loadCountries = async () => {
    const res = await CountryService.getAll();
    setCountries(res.data);
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    if (editItem) {
      await CountryService.update(editItem.id, values);
    } else {
      await CountryService.create(values);
    }
    loadCountries();
    resetForm();
    setEditItem(null);
    setOpen(false);
  };

  const handleDelete = async (id) => {
    await CountryService.remove(id);
    loadCountries();
  };

  return (
    <div>
      <h2>Country Management</h2>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add new
      </Button>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.code}</td>
              <td>{c.description}</td>
              <td>
                <Button onClick={() => { setEditItem(c); setOpen(true); }}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(c.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog Add/Edit */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editItem ? "Edit Country" : "Add Country"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editItem || { name: "", code: "", description: "" }}
            validationSchema={schema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ handleChange, values }) => (
              <Form>
                <TextField
                  margin="dense"
                  label="Name"
                  name="name"
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Code"
                  name="code"
                  fullWidth
                  value={values.code}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Description"
                  name="description"
                  fullWidth
                  value={values.description}
                  onChange={handleChange}
                />
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">
                    {editItem ? "Update" : "Save"}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
