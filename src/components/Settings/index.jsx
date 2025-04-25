import { useTheme } from '../../contexts/themeContext';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './style.scss';

const Settings = () => {
  const { mode, changeThemeMode } = useTheme();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currentMode, setCurrentMode] = useState(mode || localStorage.getItem('mode'));

  const layoutChange = (val) => {
    localStorage.setItem('mode', val);
    changeThemeMode(val);
  };

  useEffect(() => {
    setCurrentMode(localStorage.getItem('mode'));
  }, [localStorage.getItem('mode')]);

  return (
    <div className={currentMode}>
      <div className="pct-c-btn">
        <a onClick={handleShow}>
          <i className="fas fa-cog"></i>
        </a>
      </div>
      <Offcanvas show={show} className={currentMode} placement="end" onHide={handleClose}>
        <Offcanvas.Header>
          <div className="d-flex w-full justify-content-between align-items-center ">
            <h5 className="offcanvas-title">Settings</h5>
            <div className="d-inline-flex align-items-center gap-1">
              <button type="button" className="btn btn-sm rounded btn-outline-danger" id="layoutreset">
                Reset
              </button>
              <button className="btn btn-sm" onClick={() => setShow(!show)}>
                X
              </button>
            </div>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="pc-dark">
            <div className="align-items-center">
              <div className="flex-shrink-0 mb-2">
                <h6 className="mb-1">Theme Mode</h6>
                <p className="text-muted text-sm mb-0">Light / Dark / System</p>
              </div>
              <div className="d-flex">
                <div
                  className={`preset-btn ${mode === 'light' ? 'active' : ''} bg-transparent`}
                  title="Light"
                  onClick={() => layoutChange('light')}
                >
                  <span className="fas fa-sun text-warning f-20"></span>
                </div>
                <div
                  className={`preset-btn ${mode === 'dark' ? 'active' : ''}  bg-transparent`}
                  title="Dark"
                  onClick={() => layoutChange('dark')}
                >
                  <span className="fas fa-moon text-secondary f-20"></span>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Settings;
