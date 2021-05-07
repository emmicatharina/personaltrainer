import React, { useReducer, useCallback, useEffect } from 'react';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
  TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';

function Calendar() {
  const getData = (setData, setLoading) => {
    const dataUrl = 'https://customerrest.herokuapp.com/gettrainings';
    setLoading(true);

    return fetch(dataUrl)
      .then(response => response.json())
      .then((data) => {
        setTimeout(() => {
          setData(data);
          setLoading(false);
        }, 600);
      });
  };

  const styles = {
    toolbarRoot: {
      position: 'relative',
    },
    progress: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      left: 0,
    }
  };

  const ToolbarWithLoading = withStyles(styles, {
    name: 'Toolbar'
  })(
    ({ children, classes, ...restProps }) => (
      <div className={classes.toolbarRoot}>
        <Toolbar.Root {...restProps}>
          {children}
        </Toolbar.Root>
        <LinearProgress className={classes.progress} />
      </div>
    ),
  );

  const mapAppointmentData = appointment => ({
    id: appointment.id,
    startDate: moment(appointment.date).toISOString(),
    endDate: moment(appointment.date).add(appointment.duration, 'm'),
    title: appointment.activity + 
            ' (' + appointment.customer.firstname + 
            ' ' + appointment.customer.lastname + ')',
  });

  const initialState = {
    data: [],
    loading: false,
    currentDate: new Date(),
    currentViewName: 'Day',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setLoading':
        return { ...state, loading: action.payload };
      case 'setData':
        return {
          ...state, data:
            action.payload.map(mapAppointmentData)
        };
      case 'setCurrentViewName':
        return { ...state, currentViewName: action.payload };
      case 'setCurrentDate':
        return { ...state, currentDate: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    data, loading, currentViewName, currentDate,
  } = state;
  const setCurrentViewName = useCallback(nextViewName => dispatch({
    type: 'setCurrentViewName', payload: nextViewName,
  }), [dispatch]);
  const setData = useCallback(nextData => dispatch({
    type: 'setData', payload: nextData,
  }), [dispatch]);
  const setCurrentDate = useCallback(nextDate => dispatch({
    type: 'setCurrentDate', payload: nextDate,
  }), [dispatch]);
  const setLoading = useCallback(nextLoading => dispatch({
    type: 'setLoading', payload: nextLoading,
  }), [dispatch]);

  useEffect(() => {
    getData(setData, setLoading);
  }, [setData, currentViewName, currentDate]);

  return (
    <Paper>
      <Scheduler
        data={data}
        height={700}
      >
        <ViewState
          currentDate={currentDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={setCurrentViewName}
          onCurrentDateChange={setCurrentDate}
        />
        <DayView
          startDayHour={7}
          endDayHour={21}
        />
        <WeekView
          startDayHour={7}
          endDayHour={21}
        />
        <MonthView />

        <Appointments />
        <Toolbar
          {...loading ? { rootComponent: ToolbarWithLoading } : null}
        />
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <AppointmentTooltip
          showOpenButton
          showCloseButton
        />
        <AppointmentForm readOnly />
      </Scheduler>
    </Paper>
  );
}

export default Calendar;
