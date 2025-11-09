// src/country/CountryIndex.jsx
import React, { useEffect, useState } from "react";
import { CountryService } from "./CountryService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Pagination,
  Stack,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const countrySchema = Yup.object({
  name: Yup.string().required("Tên không được để trống"),
  code: Yup.string().required("Mã không được để trống"),
  description: Yup.string(),
});

const emptyCountry = { id: null, name: "", code: "", description: "" };

export default function CountryIndex() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1); // UI (1-based)
  const [size] = useState(5);         // số bản ghi mỗi trang
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // load list từ API
  const loadData = async (pageNumber = page, kw = keyword) => {
    try {
      setLoading(true);
      // backend thường dùng page 0-based
      const res = await CountryService.getPaging(pageNumber - 1, size, kw);
      const data = res.data;

      // Nếu backend trả về dạng Spring Data Page
      // { content, totalPages, totalElements, ... }
      setCountries(data.content || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error load countries:", err);
      alert("Lỗi khi tải danh sách Country, kiểm tra console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
    loadData(value, keyword);
  };

  const handleSearch = () => {
    setPage(1);
    loadData(1, keyword);
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditing(item);
    setOpenForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${item.name}?`)) return;
    try {
      await CountryService.remove(item.id);
      loadData();
    } catch (err) {
      console.error("Error delete:", err);
      alert("Xóa thất bại, kiểm tra console.");
    }
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    try {
      if (editing && editing.id != null) {
        await CountryService.update(editing.id, values);
      } else {
        await CountryService.create(values);
      }
      resetForm();
      setOpenForm(false);
      setEditing(null);
      loadData();
    } catch (err) {
      console.error("Error save:", err);
      alert("Lưu thất bại, kiểm tra console.");
    }
  };

  return (
    <div>
      <h2>Country Management (REST API)</h2>

      {/* SEARCH */}
      <div style={{ margin: "16px 0", display: "flex", gap: 8 }}>
        <TextField
          size="small"
          placeholder="Nhập từ khóa tên / mã..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleOpenAdd}>
          Add new
        </Button>
      </div>

      {/* TABLE */}
      {loading ? (
        <CircularProgress />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c, idx) => (
              <tr key={c.id ?? idx}>
                <td>{(page - 1) * size + idx + 1}</td>
                <td>{c.name}</td>
                <td>{c.code}</td>
                <td>{c.description}</td>
                <td>
                  <Button size="small" onClick={() => handleOpenEdit(c)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(c)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {countries.length === 0 && (
              <tr>
                <td colSpan={5}>Không có dữ liệu.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* PAGINATION */}
      <Stack spacing={2} marginTop={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      {/* DIALOG ADD / EDIT */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>{editing ? "Edit Country" : "Add Country"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editing || emptyCountry}
            enableReinitialize
            validationSchema={countrySchema}
            onSubmit={handleSubmitForm}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <TextField
                  margin="dense"
                  label="Name"
                  name="name"
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  margin="dense"
                  label="Code"
                  name="code"
                  fullWidth
                  value={values.code}
                  onChange={handleChange}
                  error={touched.code && Boolean(errors.code)}
                  helperText={touched.code && errors.code}
                />
                <TextField
                  margin="dense"
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  minRows={3}
                  value={values.description}
                  onChange={handleChange}
                />

                <DialogActions sx={{ paddingRight: 0, paddingBottom: 0 }}>
                  <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">
                    {editing ? "Update" : "Save"}
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
