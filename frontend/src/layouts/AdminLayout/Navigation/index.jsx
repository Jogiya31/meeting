import React, { useContext } from 'react';

import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import navigation from '../../../menu-items';
import { useTheme } from '../../../contexts/themeContext';
import { useAuth } from '../../../contexts/AuthContext';

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { mode } = useTheme();
  const { role } = useAuth();
  const { collapseMenu } = configContext.state;
  const windowSize = useWindowSize();

  let navClass = ['pcoded-navbar'];

  navClass = [...navClass, mode];

  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

  let navBarClass = ['navbar-wrapper'];

  let navContent = (
    <div className={navBarClass.join(' ')}>
      <NavLogo />
      {role === 'superadmin' ? (
        <NavContent navigation={navigation.superAdmin} />
      ) : role === 'admin' ? (
        <NavContent navigation={navigation.admin} />
      ) : (
        <NavContent navigation={navigation.user} />
      )}
    </div>
  );
  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavLogo />
        {role === 'superadmin' ? (
          <NavContent navigation={navigation.superAdmin} />
        ) : role === 'admin' ? (
          <NavContent navigation={navigation.admin} />
        ) : (
          <NavContent navigation={navigation.user} />
        )}
      </div>
    );
  }
  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
