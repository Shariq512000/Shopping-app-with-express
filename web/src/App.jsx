import { useState, useEffect } from "react"
import axios from "axios";
import { Formik, Form, Field, useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import CancelIcon from '@mui/icons-material/Cancel';
// import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import { AiTwotoneEdit } from 'react-icons/ai';
import { GrUpdate } from 'react-icons/gr';
import SearchAppBar from "./header";
import "./App.css";



let baseUrl = "";
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3001";
}

function App() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [failDeleteOpen, setFailDeleteOpen] = useState(false);
  const [updatedOpen, setUpdatedOpen] = useState(false);
  const [failUpdatedOpen, setFailUpdatedOpen] = useState(false);
  const [loadProducts, setLoadProducts] = useState(false);
  const [clickEdit, setClickEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);



  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products`)
      console.log("response: ", response.data);
      setProducts(response.data.data);
    }
    catch (error) {
      console.log("error in getting all Products: ", error);
    }
  }

  useEffect(() => {
    getAllProducts();

  }, [loadProducts])



  let handleClose = () => {
    setOpen(false);
    setErrorOpen(false);
    setDeleteOpen(false);
    setFailDeleteOpen(false);
    setUpdatedOpen(false);
    setFailUpdatedOpen(false);
  }

  let deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/product/${id}`)
      console.log("response: ", response.data);
      setLoadProducts(!loadProducts);
      setDeleteOpen(true);
    }
    catch (error) {
      console.log("requested failed: ", error);
      setFailDeleteOpen(true);
    }
  }
  let editProduct = (product) => {
    setClickEdit(!clickEdit);
    setCurrentProduct(product);
    editFormik.setFieldValue("name", product.name)
    editFormik.setFieldValue("price", product.price)
    editFormik.setFieldValue("description", product.description)
  }





  const validationSchema = yup.object({
    name: yup
      .string('Enter Product Name')
      .required('Name is Required'),
    price: yup
      .number('Enter a valid price')
      .integer('Enter a valid price')
      .positive('Price should be positive')
      .required('Price is Required'),
    description: yup
      .string('Enter a valid Discription')
      .required('Discription is Required'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("values: ", values);
      axios.post(`${baseUrl}/product`, {

        name: formik.values.name,
        price: formik.values.price,
        description: formik.values.description,
      })
        .then(response => {
          let message = response.data.message;
          console.log("message: ", message)
          console.log("response: ", response.data);
          setOpen(true);
          setLoadProducts(!loadProducts);


        })
        .catch(err => {
          console.log("error: ", err);
          setErrorOpen(true);
        })
    },
  });
  const editFormik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("values: ", values);
      setClickEdit(!clickEdit);
      setUpdatedOpen(true);
      axios.put(`${baseUrl}/product/${currentProduct.id}`, {

        name: editFormik.values.name,
        price: editFormik.values.price,
        description: editFormik.values.description,
      })
        .then(response => {
          setUpdatedOpen(true);
          let message = response.data.message;
          console.log("message: ", message)
          console.log("response: ", response.data);
          setLoadProducts(!loadProducts);


        })
        .catch(err => {
          setFailUpdatedOpen(true);
          console.log("error: ", err);
        })
    },
  });




  return (
    <div>
      <SearchAppBar />
      <form className="form" onSubmit={formik.handleSubmit}>
        <TextField
          id="name"
          name="name"
          label="Name: "
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <br />
        <br />

        <TextField
          id="price"
          name="price"
          label="price: "
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
        />
        <br />
        <br />

        <TextField
          id="description"
          name="description"
          label="description: "
          type="textarea"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <br />
        <br />

        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>

        {/* Successfully Alert */}

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Product Added Successfully!
          </Alert>
        </Snackbar>

        {/* Error Alert */}

        <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Required Parameter Missing!
          </Alert>
        </Snackbar>

        {/* Succfull Alert */}

        <Snackbar open={deleteOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Product deleted Successfully!
          </Alert>
        </Snackbar>

        {/* Error Alert */}

        <Snackbar open={failDeleteOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Requested failed to Delete Product!
          </Alert>
        </Snackbar>

      </form>
      <Snackbar open={updatedOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Product Edited Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={failUpdatedOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Requested failed to Edit Product!
        </Alert>
      </Snackbar>
      <br />
      <br />

      <div>
        {products.map((eachProduct, i) => (
          <div key={i} className="card">
            <p id="num">{eachProduct?.id}</p>
            <h2 id="nam">{eachProduct?.name}</h2>
            <h3 id="pri">{eachProduct?.price}</h3>
            <p id="des">{eachProduct?.description}</p>
            <IconButton aria-label="delete" size="large" color="red" style={{ color: "red" }} onClick={() => {
              deleteProduct(eachProduct?.id)
            }} >
              <DeleteIcon fontSize="inherit" color="red" />
            </IconButton>
            {
              (clickEdit && currentProduct.id === eachProduct.id) ? <IconButton aria-label="cancel" size="large" color="orange" style={{ color: "orange" }} onClick={() => {
                editProduct(eachProduct)
              }} >
                <CancelIcon fontSize="inherit" color="orange" />
              </IconButton> :
                <IconButton aria-label="edit" size="large" color="green" style={{ color: "green" }} onClick={() => {
                  editProduct(eachProduct)
                }} >
                  <EditIcon fontSize="inherit" color="green" />
                </IconButton>
            }


            {
              (clickEdit && currentProduct.id === eachProduct.id) ?
                <div>
                  <form className="form" onSubmit={editFormik.handleSubmit}>
                    <TextField
                      id="name"
                      name="name"
                      label="Name: "
                      value={editFormik.values.name}
                      onChange={editFormik.handleChange}
                      error={editFormik.touched.name && Boolean(editFormik.errors.name)}
                      helperText={editFormik.touched.name && editFormik.errors.name}
                    />
                    <br />
                    <br />

                    <TextField
                      id="price"
                      name="price"
                      label="price: "
                      type="number"
                      value={editFormik.values.price}
                      onChange={editFormik.handleChange}
                      error={editFormik.touched.price && Boolean(editFormik.errors.price)}
                      helperText={editFormik.touched.price && editFormik.errors.price}
                    />
                    <br />
                    <br />

                    <TextField
                      id="description"
                      name="description"
                      label="description: "
                      type="textarea"
                      value={editFormik.values.description}
                      onChange={editFormik.handleChange}
                      error={editFormik.touched.description && Boolean(editFormik.errors.description)}
                      helperText={editFormik.touched.description && editFormik.errors.description}
                    />
                    <br />
                    <br />

                    <IconButton color="primary" variant="contained" type="submit">

                      <GrUpdate />

                    </IconButton>


                  </form>

                </div>
                : null
            }



          </div>

        ))
        }
      </div>



    </div>

  )

}
export default App;