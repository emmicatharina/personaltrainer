import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function Customerlist() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = () => {
    fetch('https://customerrest.herokuapp.com/api/customers')
    .then(response => response.json())
    .then(data => setCustomers(data.content))
    .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    { headerName: 'First name', field: 'firstname', sortable: true, filter: true },
    { headerName: 'Last name', field: 'lastname', sortable: true, filter: true },
    { field: 'email', sortable: true, filter: true },
    { field: 'phone', sortable: true, filter: true },
    { headerName: 'Street', field: 'streetaddress', sortable: true, filter: true },
    { headerName: 'Post code', field: 'postcode', sortable: true, filter: true },
    { field: 'city', sortable: true, filter: true },
  ]

  return (
      <div>
        <div className="ag-theme-material" style={{ height: 600, width: '90%', margin: 'auto' }}>
            <AgGridReact
            rowData={customers}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={15}
            suppressCellSelection={true}
            />
        </div>
      </div>
  );
}

export default Customerlist;
