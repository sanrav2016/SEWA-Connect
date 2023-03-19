import React from 'react';
import Cookies from 'universal-cookie';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.css';

import SignIn from './SignIn.jsx';
import Sidebar from './Sidebar.jsx';
import Headerbar from './Headerbar.jsx';
import Dashboard from './Dashboard.jsx';
import Hours from './Hours.jsx';
import Chapters from './Chapters.jsx';
import Events from './Events.jsx';
import Settings from './Settings.jsx';

const theme = createTheme({
  typography: {
    fontFamily: "Karla, sans-serif"
  }
});

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
}

function Loader(props) {
  return (
    <div className={`loader-container ${props.isLoading ? '' : 'loader-hidden'} ${props.hide ? 'loader-gone' : ''}`} onTransitionEnd={ () => props.setHide(true) }>
      <div className="loader"></div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loaderHide, setLoaderHide] = React.useState(false);

  const minScreenWidth = 850;

  const { height, width } = useWindowDimensions();
  const [sidebar, setSidebar] = React.useState(true);
  const [page, setPage] = React.useState("dashboard");
  const [auth, setAuth] = React.useState(false);
  const [userData, setUserData] = React.useState({});

  const cookies = new Cookies();

  const handleLoading = () => {
    setIsLoading(false);
    }

  React.useEffect(()=>{
    window.addEventListener("load",handleLoading);
    return () => window.removeEventListener("load",handleLoading);
    },[])

  React.useEffect(() => {
    fetch("/api/auth", {
      headers: {
        "authorization": cookies.get("jwt")
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token !== "Failed") {
          userData.jwt = cookies.get("jwt");
          userData.role = data.role;
          userData.fname = data.fname;
          userData.lname = data.lname;
          setAuth(true);
        }
    });
  }, []);

  React.useEffect(() => {
    setPage("dashboard");
  }, [auth]);

  const toggleSidebar = () => setSidebar(!sidebar);

  const renderPage = (pageName) => {
    switch (pageName) {
      case "dashboard":
        return (<Dashboard userData={ userData } />);
        break;
      case "hours":
          return (<Hours userData={ userData } />);
          break;
      case "chapters":
        return (<Chapters userData={ userData } />);
        break;
      case "events":
        return (<Events userData={ userData } />);
        break;
      case "settings":
        return (<Settings userData={ userData } />);
        break;
    }
  }

  return (
    <>
    { !loaderHide ? (<Loader isLoading={ isLoading } hide={ loaderHide } setHide={ setLoaderHide } />) : null }
    <ThemeProvider theme={ theme }>
      { !(auth) ? (
        <SignIn userData={ userData } setAuth={ setAuth } cookies={ cookies } />
      ) : (
        <div className="app-container" 
              onClick={ (width < minScreenWidth && !sidebar) ? toggleSidebar : null }>
          <Sidebar userData={ userData } setAuth={ setAuth } sidebar={ sidebar } page={ page } setPage={ setPage } cookies={ cookies } />
          <Headerbar toggleSidebar={ toggleSidebar } />
          <div className="content">{ renderPage(page) }</div>
        </div>
      ) }
    </ThemeProvider>
    </>
  );
}

export default App;
