import { useTheme } from '../../contexts/themeContext';
import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './style.scss';

const Settings = () => {
  const { mode, theme, navColor, logoColor, changeMode, changeThemeMode, changeNavColor, changeLogoColor } = useTheme();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [currentMode, setCurrentMode] = useState(mode || localStorage.getItem('mode'));
  const [currentTheme, setCurrentTheme] = useState(mode || localStorage.getItem('theme'));

  const ModeChange = (val) => {
    localStorage.setItem('mode', val);
    changeMode(val);
  };

  const ThemeChange = (val) => {
    localStorage.setItem('theme', val);
    changeThemeMode(val);
  };

  useEffect(() => {
    setCurrentMode(localStorage.getItem('mode'));
    setCurrentTheme(localStorage.getItem('theme'));
  }, [localStorage.getItem('mode'), localStorage.getItem('theme')]);

  const handleReset = () => {
    ModeChange('light');
    ThemeChange('static');
    changeNavColor('');
    localStorage.removeItem('navColor');
    changeLogoColor('');
    localStorage.removeItem('logoColor');
  };

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
              <button type="button" className="btn btn-sm rounded btn-outline-danger" onClick={handleReset}>
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
                <p className="text-muted text-sm mb-0">Light / Dark</p>
              </div>
              <div className="d-flex">
                <div
                  className={`preset-btn pointer ${mode === 'light' ? 'active' : ''} bg-transparent`}
                  title="Light"
                  onClick={() => ModeChange('light')}
                >
                  <span className="fas fa-sun text-warning f-20"></span>
                </div>
                <div
                  className={`preset-btn pointer ${mode === 'dark' ? 'active' : ''}  bg-transparent`}
                  title="Dark"
                  onClick={() => ModeChange('dark')}
                >
                  <span className="fas fa-moon text-secondary f-20"></span>
                </div>
              </div>
            </div>
            <div className="align-items-center mt-4  ">
              <div className="flex-shrink-0 mb-2">
                <h6 className="mb-1">Themes style</h6>
                <p className="text-muted text-sm mb-0">Gradient / Static </p>
              </div>
              <div className="d-flex">
                <div
                  className={`preset-btn default-bg  pointer ${theme === 'static' ? 'active' : ''}`}
                  title="Static"
                  onClick={() => ThemeChange('static')}
                ></div>
                <div
                  className={`preset-btn grd-bg-color-8 pointer ${theme === 'gradient' ? 'active' : ''}`}
                  title="Gradient"
                  onClick={() => ThemeChange('gradient')}
                ></div>
              </div>
            </div>
            <div className="align-items-center mt-4  ">
              <div className="flex-shrink-0 mb-2">
                <h6 className="mb-1">Logo Theme</h6>
                <p className="text-muted text-sm mb-0">Choose your Logo theme color</p>
              </div>
              <div className="d-flex">
                <div className="theme-color navbar-color">
                  <a href="#!" className={`blue ${logoColor === 'blue' ? 'active' : ''}`} onClick={() => changeLogoColor('blue')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`primary  ${logoColor === 'primary' ? 'active' : ''}`} onClick={() => changeLogoColor('primary')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`warning  ${logoColor === 'warning' ? 'active' : ''}`} onClick={() => changeLogoColor('warning')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`success  ${logoColor === 'success' ? 'active' : ''}`} onClick={() => changeLogoColor('success')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`purple  ${logoColor === 'purple' ? 'active' : ''}`} onClick={() => changeLogoColor('purple')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`danger  ${logoColor === 'danger' ? 'active' : ''}`} onClick={() => changeLogoColor('danger')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`brown  ${logoColor === 'brown' ? 'active' : ''}`} onClick={() => changeLogoColor('brown')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                </div>
              </div>
            </div>
            <div className="align-items-center mt-4  ">
              <div className="flex-shrink-0 mb-2">
                <h6 className="mb-1">Navbar Theme</h6>
                <p className="text-muted text-sm mb-0">Choose your Navbar theme color</p>
              </div>
              <div className="d-flex">
                <div className="theme-color navbar-color">
                  <a href="#!" className={`blue ${navColor === 'blue' ? 'active' : ''}`} onClick={() => changeNavColor('blue')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`primary  ${navColor === 'primary' ? 'active' : ''}`} onClick={() => changeNavColor('primary')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`warning  ${navColor === 'warning' ? 'active' : ''}`} onClick={() => changeNavColor('warning')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`success  ${navColor === 'success' ? 'active' : ''}`} onClick={() => changeNavColor('success')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`purple  ${navColor === 'purple' ? 'active' : ''}`} onClick={() => changeNavColor('purple')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`danger  ${navColor === 'danger' ? 'active' : ''}`} onClick={() => changeNavColor('danger')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
                  <a href="#!" className={`brown  ${navColor === 'brown' ? 'active' : ''}`} onClick={() => changeNavColor('brown')}>
                    <i className="fas fa-check-double"></i>
                  </a>{' '}
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
