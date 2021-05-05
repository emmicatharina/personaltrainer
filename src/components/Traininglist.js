import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Traininglist() {
  const [trainings, setTrainings] = useState([]);

  const fetchTrainings = () => {
    fetch('https://customerrest.herokuapp.com/gettrainings')
    .then(response => response.json())
    .then(data => setTrainings(data))
    .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchTrainings();
  }, []);

  const columns = [
    { field: 'date', sortable: true, filter: true },
    { field: 'duration', sortable: true, filter: true },
    { field: 'activity', sortable: true, filter: true },
    { headerName: 'First name', field: 'customer.firstname', sortable: true, filter: true  },
    { headerName: 'Last name', field: 'customer.lastname', sortable: true, filter: true  }
  ]


  return (
      <div>
        <div className="ag-theme-material" style={{ height: 600, width: '90%', margin: 'auto' }}>
            <AgGridReact
            rowData={trainings}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={15}
            suppressCellSelection={true}
            />
        </div>
      </div>
  );
}

export default Traininglist;
