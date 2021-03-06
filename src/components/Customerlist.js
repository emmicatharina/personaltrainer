import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import AddTraining from './AddTraining';

import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

function Customerlist() {
  const api = axios.create({
    baseURL: 'https://customerrest.herokuapp.com/api',
    headers: {
      "Content-type": "application/json"
    }
  })

  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('');
  const columns = [
    {
      editable: 'never', field: 'links[0].href', render: (rowData =>
        <AddTraining customer={rowData} addTraining={addTraining} />)
    },
    { title: 'First name', field: 'firstname' },
    { title: 'Last name', field: 'lastname' },
    { title: 'Email', field: 'email' },
    { title: 'Phone', field: 'phone' },
    { title: 'Address', field: 'streetaddress' },
    { title: 'Post code', field: 'postcode' },
    { title: 'City', field: 'city' }
  ];

  const fetchCustomers = () => {
    api.get('/customers')
      .then(res => {
        setCustomers(res.data.content)
      })
      .catch(err => {
        console.error(err)
      })
  }
  
  const openSnackbar = () => {
    setOpen(true);
  }

  const closeSnackbar = () => {
    setOpen(false);
  }

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    api.put(newData.links[1].href, newData)
      .then(res => {
        const dataUpdate = [...customers];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setCustomers([...dataUpdate]);
        setMsg('Customer updated succesfully!')
        setSeverity('success');
        openSnackbar();
        fetchCustomers();
        resolve()
      })
      .catch(err => {
        console.error(err)
        resolve()
      })
  }

  const handleRowAdd = (newData, resolve) => {
    api.post('/customers', newData)
      .then(res => {
        let dataToAdd = [...customers];
        dataToAdd.push(newData);
        setCustomers(dataToAdd);
        setMsg('Customer added succesfully!')
        setSeverity('success');
        openSnackbar();
        fetchCustomers();
        resolve()
      })
      .catch(err => {
        console.error(err)
        resolve()
      })
  }

  const handleRowDelete = (oldData, resolve) => {
    api.delete(oldData.links[1].href)
      .then(res => {
        const dataDelete = [...customers];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setCustomers([...dataDelete]);
        setMsg('Customer deleted succesfully!')
        setSeverity('success');
        openSnackbar();
        fetchCustomers();
        resolve()
      })
      .catch(err => {
        console.error(err)
        resolve()
      })
  }

  const addTraining = (newTraining) => {
    fetch('https://customerrest.herokuapp.com/api/trainings', {
      method: 'POST',
      body: JSON.stringify(newTraining),
      headers: { 'Content-type': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          setMsg('Training added succesfully!')
          setSeverity('success');
          openSnackbar();
          fetchCustomers()
        } else {
          setMsg('Something went wrong!')
          setSeverity('error');
          openSnackbar();
        }
      })
      .catch(err => console.error(err))
  }

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  return (
    <div>
      <MaterialTable
        columns={columns}
        data={customers}
        title="Customers"
        icons={tableIcons}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => (
              handleRowDelete(oldData, resolve)
            )),
        }}
      />
      <Snackbar 
        open={open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert onClose={closeSnackbar} severity={severity}>
          {msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Customerlist;
