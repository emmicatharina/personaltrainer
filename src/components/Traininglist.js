import React, { useState, useEffect, forwardRef } from 'react';
import moment from 'moment';
import axios from 'axios';
import MaterialTable from 'material-table';

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

function Traininglist() {
  const api = axios.create({
    baseURL: 'https://customerrest.herokuapp.com',
    headers: {
      "Content-type": "application/json"
    }
  })

  const [trainings, setTrainings] = useState([]);
  const columns = [
    { title: 'id', filed: 'id', hidden: true },
    { title: 'Date', field: 'date', render: rowData => moment(rowData.date).format("LLL") },
    { title: 'Duration', field: 'duration' },
    { title: 'Activity', field: 'activity' },
    { title: 'Customer', field: 'customer.firstname', render: (trainings) => {
      return `${trainings.customer.firstname} ${trainings.customer.lastname}`;
    } }
  ]

  const fetchTrainings = () => {
    api.get('/gettrainings')
      .then(res => {
        setTrainings(res.data)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const handleRowDelete = (oldData, resolve) => {
    api.delete('/api/trainings/' + oldData.id)
    .then(res => {
      const dataDelete = [...trainings];
      const index = oldData.tableData.id;
      dataDelete.splice(index, 1);
      setTrainings([...dataDelete]);
      fetchTrainings();
      resolve()
    })
    .catch(err => {
      console.error(err)
    }) 
  }

  useEffect(() => {
    fetchTrainings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        data={trainings}
        title="Trainings"
        icons={tableIcons}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve) => (
              handleRowDelete(oldData, resolve)
          )), 
        }}
      />
    </div>
  );
}

export default Traininglist;
