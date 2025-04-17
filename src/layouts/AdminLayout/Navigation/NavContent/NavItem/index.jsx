import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import NavIcon from '../NavIcon';
import NavBadge from '../NavBadge';

import { ConfigContext } from '../../../../../contexts/ConfigContext';
import * as actionType from '../../../../../store/actions';
import useWindowSize from '../../../../../hooks/useWindowSize';

const NavItem = ({ item }) => {
  const windowSize = useWindowSize();
  const configContext = useContext(ConfigContext);
  const { dispatch } = configContext;
  const navigate = useNavigate(); // needed to redirect if using router navigation

  let itemTitle = item.icon ? <span className="pcoded-mtext">{item.title}</span> : item.title;
  let itemTarget = item.target ? '_blank' : '';

  const handleLogoutClick = async (e) => {
    e.preventDefault(); // prevent default link behavior
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
    });

    if (result.isConfirmed) {
      navigate(item.url); // this will go to the logout route
    }
  };

  let subContent;
  if (item.external) {
    subContent = (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        <NavIcon items={item} />
        {itemTitle}
        <NavBadge items={item} />
      </a>
    );
  } else {
    subContent = (
      <NavLink
        to={item.url}
        className="nav-link"
        target={itemTarget}
        onClick={item.id === 'logout' ? handleLogoutClick : null}
      >
        <NavIcon items={item} />
        {itemTitle}
        <NavBadge items={item} />
      </NavLink>
    );
  }

  const mainContent = (
    <ListGroup.Item
      as="li"
      bsPrefix=" "
      className={item.classes}
      style={{ display: item.display ? 'block' : 'none' }}
      onClick={() => {
        if (windowSize.width < 992) dispatch({ type: actionType.COLLAPSE_MENU });
      }}
    >
      {subContent}
    </ListGroup.Item>
  );

  return <>{mainContent}</>;
};

NavItem.propTypes = {
  item: PropTypes.object,
  title: PropTypes.string,
  icon: PropTypes.string,
  target: PropTypes.string,
  external: PropTypes.bool,
  url: PropTypes.string,
  classes: PropTypes.string,
};

export default NavItem;
