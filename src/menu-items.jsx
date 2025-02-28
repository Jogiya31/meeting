const menuItems = {
  items: [
    {
      id: 'menu',
      title: 'Menus',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/dashboard',
          classes: 'nav-item',
          icon: 'feather icon-grid',
          display: true
        },
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          url: '/users',
          classes: 'nav-item',
          icon: 'feather icon-users',
          display: true
        },
        {
          id: 'attendance',
          title: 'Attendance',
          type: 'collapse',
          icon: 'feather icon-user-check',
          display: false,
          children: [
            {
              id: 'markAttendance',
              title: "Mark today's Attendance",
              type: 'item',
              url: '/today',
              display: true,
              icon: 'fas fa-circle'
            },
            {
              id: 'exportAttendance',
              title: 'Export Attendance',
              type: 'item',
              url: '/exportAttendance',
              display: true,
              icon: 'fas fa-circle'
            }
          ]
        }
      ]
    },
    {
      id: 'MoM',
      title: 'MoM',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'meeting',
          title: 'Meeting',
          type: 'collapse',
          icon: 'fas fa-handshake',
          display: true,
          children: [
            {
              id: 'todays_Point',
              title: 'Todays Points',
              type: 'item',
              url: '/newPoints',
              display: true
            },
            {
              id: 'view_history',
              title: 'View Histoy',
              type: 'item',
              url: '/viewPoints',
              display: true
            },
            {
              id: 'meetingattendance',
              title: 'Attendance',
              type: 'item',
              url: '/meeting-attendance',
              display: false
            }
          ]
        }
      ]
    },
    {
      id: 'setting',
      title: 'Settings',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'settings',
          title: 'Settings',
          type: 'item',
          url: '/settings',
          classes: 'nav-item',
          icon: 'fas fa-cogs',
          display: true
        },
        {
          id: 'logout',
          title: 'Logout',
          type: 'item',
          url: '/logout',
          classes: 'nav-item',
          icon: 'feather icon-log-out',
          display: true
        }
      ]
    }
  ]
};

export default menuItems;
