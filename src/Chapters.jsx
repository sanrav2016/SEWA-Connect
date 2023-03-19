import React from 'react';
import './App.css';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function Chapters(props) {

  const [myChapters, setMyChapters] = React.useState([]);
  const [currentChapterData, setCurrentChapterData] = React.useState([]);
  const [selectValue, setSelectValue] = React.useState("");

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
        fetch("/api/chapter_data", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "authorization": props.userData.jwt
          },
          body: JSON.stringify(i)
        })
        .then((res) => res.json())
        .then((data) => {
          setCurrentChapterData(data);
        });
      }
    })
  }, [selectValue]);

  const columns = [
    { field: 'first_name', headerName: 'First name', width: 200 },
    { field: 'last_name', headerName: 'Last name', width: 200 },
    { field: 'role', headerName: 'Role', width: 200 }
  ];

  return (
    <>
    <div className="content-container">
      <div className="header">Chapters</div>
      { myChapters.length > 0 ? (
      <>
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
          rows={currentChapterData.map((c) => ({
            id: c.id,
            first_name: c.first_name,
            last_name: c.last_name,
            role: c.role.substr(0, 1).toUpperCase() + c.role.substr(1)
          }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
      </>
      ) : ( <>No chapters found</> )
      }
    </div>
    </>
  );
}

export default Chapters;
