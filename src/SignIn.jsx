import React from 'react';
import './App.css';
import { Person, Key } from '@mui/icons-material';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}
  
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

function SignIn(props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorDialog, setErrorDialog] = React.useState(false);
  const [signInButtonDisabled, setSignInButtonDisabled] = React.useState(false);

  const sendSignInRequest = () => {
    setSignInButtonDisabled(true);
    const signInData = {
      "username": username,
      "password": password
    }
    fetch("/api/signIn", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(signInData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token !== "Failed") {
          props.cookies.set('jwt', data.token, { path: '/', maxAge: '2000' });
          props.userData.jwt = data.token;
          props.userData.role = data.role;
          props.userData.fname = data.fname;
          props.userData.lname = data.lname;
          props.setAuth(true);
        } else {
          setErrorDialog(true);
          setSignInButtonDisabled(false);
        }
      });
  }

  return (
    <div className="sign-in-container">
      <div className="display-panel" 
      style={{
        backgroundImage: `url(${images["sign-in-display.png"]})`
        }}>
      </div>
      <div className="main-panel">
        <img src={images["sign-in-banner.png"]} />
        <div className="inputs-container">
            <div className="section-wrapper">
                <div className="input-wrapper">
                    <Person className="icon" />
                    <input placeholder="Email" value={ username } onChange={ (e) => setUsername(e.target.value) } />
                </div>
            </div>
            <div className="section-wrapper">
                <div className="input-wrapper">
                    <Key className="icon"/>
                    <input placeholder="Password" type="password" value={ password } onChange={ (e) => setPassword(e.target.value) } />
                </div>
                { (errorDialog) ? (<label className="error-text">Incorrect email or password</label>) : (<></>) }
            </div>
            <button onClick={ sendSignInRequest } disabled={ signInButtonDisabled }>Sign in</button>
            <a href="">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;