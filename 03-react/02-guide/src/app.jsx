/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import React from 'react';

function helloWorld() {
  return <h1>Hello, World!</h1>;
}

function welcomeUser(props) {
  return (
    <h2>
      Welcome
      {' '}
      {props.name}
      !
    </h2>
  );
}

class Line extends React.Component {
  render() {
    return <hr />;
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState({
        time: new Date(),
      }),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const { time } = this.state;
    return (
      <p>
        Current time is:
        {' '}
        {time.toLocaleTimeString()}
      </p>
    );
  }
}

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: false,
    };
  }

  // See: https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
  handleClick = () => {
    const { isToggleOn } = this.state;
    this.setState({
      isToggleOn: !isToggleOn,
    });
  };

  render() {
    const { isToggleOn } = this.state;
    return (
      <p>
        Press the button to toggle state:
        {' '}
        <button type="button" onClick={this.handleClick}>
          {isToggleOn ? 'ON' : 'OFF'}
        </button>
      </p>
    );
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      nextEntry: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      nextEntry: e.target.value,
    });
  };

  handleSubmit = (e) => {
    const { nextEntry, list } = this.state;
    if (nextEntry !== '') {
      this.setState({
        list: list.concat([nextEntry]),
        nextEntry: '',
      });
    }

    e.preventDefault();
  };

  handleSubmitClear = (e) => {
    this.setState({
      list: [],
      nextEntry: '',
    });
    e.preventDefault();
  };

  render() {
    const { nextEntry, list } = this.state;
    const listElements = list.map((e, i) => (
      <p key={i}>
        #
        {i}
        :
        {e}
      </p>
    ));

    return (
      <div
        style={{
          border: 'dotted',
          marginTop: '10px',
          display: 'inline-block',
          padding: '10px',
        }}
      >
        <p>List of Items:</p>
        {listElements}
        <form onSubmit={this.handleSubmit}>
          <label>
            New Entry:
            {' '}
            <input
              type="text"
              value={nextEntry}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <form onSubmit={this.handleSubmitClear}>
          <label>Clear list: </label>
          <input type="submit" value="Clear!" />
        </form>
      </div>
    );
  }
}

function Greeting(props) {
  const { isLoggedIn } = props;
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }

  return <h1>Please sign up.</h1>;
}

function LoginButton(props) {
  const { onClick } = props;
  return <button type="button" onClick={onClick}>Login</button>;
}

function LogoutButton(props) {
  const { onClick } = props;
  return <button type="button" onClick={onClick}>Logout</button>;
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = { isLoggedIn: false };
  }

  handleLoginClick() {
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }

  render() {
    const { isLoggedIn } = this.state;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

class ControlledText extends React.Component {
  render() {
    const { value, onChange } = this.props;

    return <input type="text" value={value} onChange={onChange} />;
  }
}

class SynchronizedText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      text: e.target.value,
    });
    e.preventDefault();
  };

  render() {
    const { text } = this.state;

    return (
      <div>
        <p>These inputs are synchronized: </p>
        <ControlledText value={text} onChange={this.handleChange} />
        <br />
        <ControlledText value={text} onChange={this.handleChange} />
        <br />
        <ControlledText value={text} onChange={this.handleChange} />
        <br />
      </div>
    );
  }
}

function ExampleDotCom() {
  return (
    <button
      type="button"
      onClick={() => {
        window.location = 'https://example.com';
      }}
    >
      Go to
      {' '}
      example.com
    </button>
  );
}

class URLHash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: window.location.hash,
    };

    window.addEventListener('hashchange', () => this.setState({ hash: window.location.hash }));
  }

  render() {
    const { hash } = this.state;
    const params = new URLSearchParams(hash.slice(1));

    const paramsList = [];
    params.forEach((value, key) => {
      paramsList.push((
        <p key={key}>
          <b>{key}</b>
          :
          {value}
        </p>
      ));
    });

    return (
      <div>
        <h3>List of hash parameters: </h3>
        {paramsList}
      </div>
    );
  }
}

function App() {
  return (
    <div>
      {helloWorld()}
      {welcomeUser({ name: 'whatsmyname' })}
      <Line />
      <Clock />
      <Toggle />
      <List />
      <LoginControl />
      <Line />
      <SynchronizedText />
      <Line />
      <ExampleDotCom />
      <Line />
      <URLHash />
    </div>
  );
}

export default App;
