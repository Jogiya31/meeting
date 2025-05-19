import React from 'react';

const NotFound = () => {
  return (
    <div id="notfound" style={styles.notfound}>
      <div style={styles.notfoundContainer}>
        <div style={styles.notfound404}>
          <h1 style={styles.errorText}>ERROR</h1>
        </div>
        <h3 style={styles.heading}>Oops! Something went wrong.</h3>
        <p style={styles.paragraph}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a href="/" style={styles.button}>Back To Homepage</a>
      </div>
    </div>
  );
};

const styles = {
  notfound: {
    position: 'relative',
    height: '100vh',
    margin: 0,
    padding: 0,
  },
  notfoundContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 920,
    width: '100%',
    lineHeight: 1.4,
    textAlign: 'center',
    padding: '0 15px',
  },
  notfound404: {
    position: 'absolute',
    height: 100,
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: -1,
  },
  errorText: {
    fontFamily: 'Maven Pro, sans-serif',
    color: '#ececec',
    fontWeight: 900,
    fontSize: 276,
    margin: 0,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  heading: {
    fontFamily: 'Maven Pro, sans-serif',
    fontSize: 46,
    color: '#0f0f0f',
    fontWeight: 900,
    textTransform: 'uppercase',
    margin: 0,
  },
  paragraph: {
    fontFamily: 'Maven Pro, sans-serif',
    fontSize: 16,
    color: '#1f1f1f',
    fontWeight: 400,
    marginTop: 15,
  },
  button: {
    fontFamily: 'Maven Pro, sans-serif',
    fontSize: 14,
    textDecoration: 'none',
    textTransform: 'uppercase',
    background: '#d4a017',
    display: 'inline-block',
    padding: '16px 38px',
    border: '2px solid transparent',
    borderRadius: 40,
    color: '#fff',
    fontWeight: 400,
    transition: '0.2s all',
  }
};

export default NotFound;
