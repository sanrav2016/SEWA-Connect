import React from 'react';
import './App.css';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

function BasicDatePicker(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="date-picker"
        label={props.label}
        value={props.value}
        onChange={(newValue) => {
          props.setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

function BasicTimePicker(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        className="time-picker"
        label={props.label}
        value={props.value}
        onChange={(newValue) => {
          props.setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

function DateTimeObject(props) {
  const [id, setId] = React.useState(props.id);
  const [date, setDate] = React.useState(props.date);
  const [startTime, setStartTime] = React.useState(props.startTime);
  const [endTime, setEndTime] = React.useState(props.endTime);

  React.useEffect(() => {
    const datesCopy = [
      ...props.dates
    ];
    datesCopy.forEach((i, j) => {
      if (i.id == id) {
        datesCopy[j].date = date;
        datesCopy[j].startTime = startTime;
        datesCopy[j].endTime = endTime;
      }
    });
    props.setDates(datesCopy);
  }, [date, startTime, endTime])

  const removeObject = () => {
    const datesCopy = [
      ...props.dates
    ];
    const newDates = [];
    var x = 0;
    datesCopy.forEach((i) => {
      if (i.id !== id) {
        i.id = x;
        newDates.push(i);
        x++;
      }
    });
    props.setDates(newDates);
  }

  return (
    <div className="date-object">
      <div>
      <BasicDatePicker label="Date" value={ date } setValue={ setDate }  />
      </div>
      <div className="time-picker-container">
        <BasicTimePicker label="Start time" value={ startTime } setValue={ setStartTime } />
        <BasicTimePicker label="End time" value={ endTime } setValue={ setEndTime } />
        <IconButton onClick={ removeObject }>
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  )
}

function DateTimeList(props) {
  const addDate = () => {
    const datesCopy = [
      ...props.dates
    ];
    datesCopy.push({
      id: datesCopy.length, 
      date: null,
      startTime: null,
      endTime: null
    });
    props.setDates(datesCopy);
  };

  React.useEffect(() => {
    addDate();
  }, [])

  return (
    <>
    <Button variant="outlined" startIcon={<AddIcon />} style={{width: 100}} onClick={ addDate }>Add</Button>
    <div className="date-time-list">
      {
        props.dates.map((c) => (
          <DateTimeObject dates={ props.dates } setDates={ props.setDates } id={ c.id } date={ c.date } startTime={ c.startTime } endTime={ c.endTime } />
        ))
      }
    </div>
    </>
  )
}

function Events(props) {

  const [tabValue, setTabValue] = React.useState(0);
  const [myChapters, setMyChapters] = React.useState([]);
  const [eventList, setEventList] = React.useState([]);
  const [selectValue, setSelectValue] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: null,
    chapter: null
  });
  const [dates, setDates] = React.useState([]);

  const setFormDataParameter = (parameter, value) => {
    const formDataCopy = {
      ...formData
    };
    formDataCopy[parameter] = value;
    setFormData(formDataCopy);
  }

  React.useEffect(() => {
    fetch("/api/chapters", {
      method: "POST",
      headers: {
        "authorization": props.userData.jwt
      }
    })
    .then((res) => res.json())
    .then((data) => {
      setMyChapters(data);
    });
  }, []);

  React.useEffect(() => {
    myChapters.forEach((i) => {
      if (i.chapter_name == selectValue) {
        fetch("/api/event_data", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "authorization": props.userData.jwt
          },
          body: JSON.stringify(i)
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setEventList(data);
        });
      }
    })
  }, [selectValue]);

  const submitCreateEvent = () => {
    if (formData.name == null || formData.chapter == null || dates.length == 0)
      return console.error("error");
    dates.forEach((i) => {
      if (i.date == null || i.startTime == null || i.endTime == null)
        return console.error("error");
    });
    var chapter_id = null;
    myChapters.forEach((i) => {
      if (i.chapter_name == formData.chapter) {
        chapter_id = i.chapter_id;
      }
    });
    fetch("/api/create_event", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": props.userData.jwt
      },
      body: JSON.stringify({
        name: formData.name,
        chapter: chapter_id,
        dates: dates
      })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("request sent")
    });
  }

  return (
    <>
    <div className="header">Events</div>
    <Box sx={{width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
        <Tabs value={ tabValue } onChange={ (e, n) => setTabValue(n) }>
          <Tab label="Events by chapter" />
          { (props.userData.role == "volunteer") ? (
            <Tooltip title="You do not have this permission">
              <span>
                <Tab label="Create event" disabled />
              </span>
            </Tooltip>
          ) : (
            <Tab label="Create event" />
          ) 
          }
        </Tabs>
      </Box>
      { (tabValue == 1) ? 
      (
        <div className="content-container">
          <div className="subheading">Create event</div>
          <div className="form-container" style={{maxWidth: 600}}>
            <TextField label="Event name" variant="outlined" value={ formData.name } onChange={ (e) => setFormDataParameter("name", e.target.value) } />
            <FormControl fullWidth>
              <InputLabel>Chapter</InputLabel>
              <Select value={ formData.chapter } onChange={ (e) => setFormDataParameter("chapter", e.target.value) } label="Chapter">
              {
              myChapters.map((c) => (
                <MenuItem key={ c.chapter_id } value={ c.chapter_name }>{ c.chapter_name }</MenuItem>
              ))
              }
              </Select>
            </FormControl>
            <div>
              Add dates and times below. Double click a field to edit it.
            </div>
            <DateTimeList dates={ dates } setDates={ setDates } />
            <Button variant="contained" onClick={ submitCreateEvent }>Create</Button>
          </div>
        </div>
      ) :
      (
        <div className="content-container">
          <div className="subheading">Events by chapter</div>
          <FormControl fullWidth>
            <InputLabel>Chapter</InputLabel>
            <Select value={ selectValue } onChange={ (e) => setSelectValue(e.target.value) } label="Chapter">
            {
            myChapters.map((c) => (
              <MenuItem key={ c.chapter_id } value={ c.chapter_name }>{ c.chapter_name }</MenuItem>
            ))
            }
            </Select>
          </FormControl>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid 
              rows={
                eventList.map((c) => {
                return { 
                  id: c.event_id,
                  event_name: c.event_name,
                  start_date: new Date(c.dates[0].start_time),
                  end_date: new Date(c.dates[c.dates.length - 1].end_time),
                  all_dates: c.dates.map((x) => [new Date(x.start_time), new Date(x.end_time)])
                }
              })
              }
              columns={
                [
                  { field: 'event_name', headerName: 'Event name', width: 200 },
                  { field: 'start_date', headerName: 'Start date', width: 200, type: "dateTime" },
                  { field: 'end_date', headerName: 'End date', width: 200, type: "dateTime" }
                ]
              }
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        </div>
      )
      }
    </Box>
    </>
  );
}

export default Events;