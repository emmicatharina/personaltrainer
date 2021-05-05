import React, { useState, useEffect } from 'react';
import Customerlist from './components/Customerlist';
import Traininglist from './components/Traininglist';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function App() {
  const [value, setValue] = useState('customers');
  const handleChange = (event, value) => {
    setValue(value);
  }
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Personal Trainer
          </Typography>
        </Toolbar>
        <Tabs value={value} onChange={handleChange}>
          <Tab value="customers" label="Customers" />
          <Tab value="trainings" label="Trainings" />
        </Tabs>
      </AppBar>
      {value === 'customers' && <Customerlist />}
      {value === 'trainings' && <Traininglist />}
    </div>
  );
}

export default App;
