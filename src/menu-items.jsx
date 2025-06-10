const menuItems = {
  superAdmin: [
    {
      id: 'menu',
      title: '',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/meetings/dashboard',
          classes: 'nav-item',
          icon: 'feather icon-grid',
          display: true
        },
        {
          id: 'users',
          title: 'ManPower',
          type: 'item',
          url: '/meetings/users',
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
              url: '/meetings/today',
              display: true,
              icon: 'fas fa-circle'
            },
            {
              id: 'exportAttendance',
              title: 'Export Attendance',
              type: 'item',
              url: '/meetings/exportAttendance',
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
              title: 'Create',
              type: 'item',
              url: '/meetings/new',
              display: true
            },
            {
              id: 'view_history',
              title: 'Status',
              type: 'item',
              url: '/meetings/view',
              display: true
            },
            {
              id: 'meetingattendance',
              title: 'Attendance',
              type: 'item',
              url: '/meetings/meeting-attendance',
              display: false
            }
          ]
        }
      ]
    },
    {
      id: 'Tasks',
      title: 'Task Menu',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'task',
          title: 'Task',
          type: 'collapse',
          icon: 'fas fa-handshake',
          display: true,
          children: [
            {
              id: 'task_list',
              title: 'Task List',
              type: 'item',
              url: '/tasktracker/Task-List',
              display: true
            },
            {
              id: 'create_taskDependencies',
              title: 'Create Dependancies',
              type: 'item',
              url: '/tasktracker/create-Dependancies',
              display: true
            },
            {
              id: 'Create_tasks',
              title: 'Create Task',
              type: 'item',
              url: '/tasktracker/create-Task',
              display: true
            },
            // {
            //   id: 'tasks_Approval',
            //   title: 'Task Approval',
            //   type: 'item',
            //   url: '/tasktracker/Task-Approval',
            //   display: true
            // },
            {
              id: 'tasks_Assginment',
              title: 'Task Assignment',
              type: 'item',
              url: '/tasktracker/Task-Assignment',
              display: true
            },
            {
              id: 'create_report',
              title: 'Report',
              type: 'item',
              url: '/tasktracker/Task-Report',
              display: true
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
          title: 'Master Data',
          type: 'item',
          url: '/meetings/masterSettings',
          classes: 'nav-item',
          icon: 'fas fa-cogs',
          display: true
        },
        {
          id: 'logout',
          title: 'Logout',
          type: 'item',
          url: '/meetings/logout',
          classes: 'nav-item',
          icon: 'feather icon-log-out',
          display: true
        }
      ]
    }
  ],
  admin: [
    {
      id: 'menu',
      title: '',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/tasktracker/dashboard',
          classes: 'nav-item',
          icon: 'feather icon-grid',
          display: true
        },
        {
          id: 'users',
          title: 'ManPower',
          type: 'item',
          url: '/tasktracker/users',
          classes: 'nav-item',
          icon: 'feather icon-users',
          display: true
        }
      ]
    },
    {
      id: 'Tasks',
      title: 'Task Menu',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'task',
          title: 'Task',
          type: 'collapse',
          icon: 'fas fa-handshake',
          display: true,
          children: [
            {
              id: 'task_list',
              title: 'Task List',
              type: 'item',
              url: '/tasktracker/Task-List',
              display: true
            },
            {
              id: 'create_taskDependencies',
              title: 'Create Dependancies',
              type: 'item',
              url: '/tasktracker/create-Dependancies',
              display: true
            },
            {
              id: 'Create_tasks',
              title: 'Create Task',
              type: 'item',
              url: '/tasktracker/create-Task',
              display: true
            },
            // {
            //   id: 'tasks_Approval',
            //   title: 'Task Approval',
            //   type: 'item',
            //   url: '/tasktracker/Task-Approval',
            //   display: true
            // },
            {
              id: 'tasks_Assginment',
              title: 'Task Assignment',
              type: 'item',
              url: '/tasktracker/Task-Assignment',
              display: true
            },
            {
              id: 'create_report',
              title: 'Report',
              type: 'item',
              url: '/tasktracker/Task-Report',
              display: true
            }
          ]
        }
      ]
    },
    {
      id: 'Others',
      title: 'Others',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'logout',
          title: 'Logout',
          type: 'item',
          url: '/meetings/logout',
          classes: 'nav-item',
          icon: 'feather icon-log-out',
          display: true
        }
      ]
    }
  ],
  user: [
    {
      id: 'menu',
      title: '',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/tasktracker/dashboard',
          classes: 'nav-item',
          icon: 'feather icon-grid',
          display: true
        }
      ]
    },
    {
      id: 'Tasks',
      title: 'Task Menu',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'task',
          title: 'Task',
          type: 'collapse',
          icon: 'fas fa-handshake',
          display: true,
          children: [
            {
              id: 'task_list',
              title: 'Task List',
              type: 'item',
              url: '/tasktracker/Task-List',
              display: true
            },
            {
              id: 'tasks_Assginment',
              title: 'Task Assignment',
              type: 'item',
              url: '/tasktracker/Task-Assignment',
              display: true
            },
            {
              id: 'create_report',
              title: 'Report',
              type: 'item',
              url: '/tasktracker/Task-Report',
              display: true
            }
          ]
        }
      ]
    },
    {
      id: 'Others',
      title: 'Others',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'logout',
          title: 'Logout',
          type: 'item',
          url: '/meetings/logout',
          classes: 'nav-item',
          icon: 'feather icon-log-out',
          display: true
        }
      ]
    }
  ]
};

export default menuItems;
