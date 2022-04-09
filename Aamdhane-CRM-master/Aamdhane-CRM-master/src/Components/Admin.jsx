/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, Drawer, Row, Form, Switch, Modal, Col, message, Tabs, Alert } from 'antd';

import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  LoginOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { DataTable } from './Table/Table';
import { HCLayout } from './Layout/HCLayout';
import { AuthContext } from '../context/Authcontext';

import { request } from '../service/common';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';
import { defaultPermissions } from '../common/configs';

const { TabPane } = Tabs;

const Admin = () => {
  const [loading, setLoading] = useState(false);

  const [drawer, setDrawer] = useState(false);

  const [siderProps, setSiderProps] = useState({});

  const [editData, setEditData] = useState({});

  const [editModalVisiblity, setEditModalVisiblity] = useState(false);

  const [addUserModalVisiblity, setAddUserModalVisiblity] = useState(false);

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [phoneNo, setPhoneNo] = useState('');

  const [downloadState, setDownloadState] = useState(new Array(4).fill(true));

  const [labourersState, setLabourersState] = useState(new Array(4).fill(true));

  const [agentsState, setAgentsState] = useState(new Array(4).fill(true));

  const [factoryOwnersState, setFactoryOwnersState] = useState(new Array(4).fill(true));

  const [jobPostsState, setJobPostsState] = useState(new Array(4).fill(true));

  const [jobApplicationsState, setJobApplicationsState] = useState(new Array(4).fill(true));

  const [notification, setNotification] = useState(new Array(2).fill(true));

  const [adminAccess, setAdminAccess] = useState(new Array(2).fill(true));

  const [users, setUsers] = useState([]);

  const [disableUpdatePermissionButton, setDisableUpdatePermissionButton] = useState(true);

  const { userContext } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    request(`/api/user?role=admin`, 'GET')
      .then(async (data) => {
        data = data.reverse();
        // eslint-disable-next-line no-return-assign
        setUsers(
          data.map((item) => {
            item.key = item.id;

            let newItem = { ...item };
            if (!item?.access?.notification) {
              newItem = {
                ...newItem,
                access: {
                  ...newItem.access,
                  notification: [false, false],
                },
              };
            }
            if (!item?.access?.adminAccess) {
              newItem = {
                ...newItem,
                access: {
                  ...newItem.access,
                  adminAccess: [false, false],
                },
              };
            }
            return newItem;
          }),
        );
        // setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const setAllStatesToDefault = () => {
    setAddUserModalVisiblity(false);
    setLoading(false);
    setUsername('');
    setPassword('');
    setPhoneNo('');
    setDownloadState(new Array(4).fill(true));
    setLabourersState(new Array(4).fill(true));
    setAgentsState(new Array(4).fill(true));
    setFactoryOwnersState(new Array(4).fill(true));
    setJobPostsState(new Array(4).fill(true));
    setJobApplicationsState(new Array(4).fill(true));
    setNotification(new Array(2).fill(true));
    setAdminAccess(new Array(2).fill(true));
  };

  const onAddUser = () => {
    setAddUserModalVisiblity(true);
  };

  const onAddUserSave = () => {
    setLoading(true);

    const access = {};
    access.download = downloadState;
    access.labourers = labourersState;
    access.agents = agentsState;
    access.factoryOwners = factoryOwnersState;
    access.jobPosts = jobPostsState;
    access.jobApplications = jobApplicationsState;
    access.notification = notification;
    access.adminAccess = adminAccess;

    const values = {};
    values.username = username;
    values.password = password;
    values.phoneNo = phoneNo;
    values.access = access;

    if (values.username === '') {
      message.error('username is required');
      return;
    }

    if (values.password === '') {
      message.error('password is required');
      return;
    }
    if (values.password.length < 5) {
      message.info('Password must be 5 characters long');
      return;
    }

    if (values.phoneNo === '') {
      message.error('Phone number is required');
      return;
    }

    if (values.phoneNo.length !== 10) {
      message.info('Enter a valid phone number');
      return;
    }
    console.log('val', values);
    request('/api/auth/register', 'POST', {
      data: values,
    })
      .then(async (data) => {
        setUsers([...users, data]);
        setAllStatesToDefault();
      })
      .catch((err) => {
        setAllStatesToDefault();
        throw err;
      });
  };

  const onEdit = (record) => {
    setEditModalVisiblity(true);
    setEditData(record);
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to ban this user',
      okText: 'Yes, Ban',
      onOk: () => {
        setLoading(true);
        request(`/api/user/${record.id}`, 'DELETE')
          .then(async () => {
            setUsers(
              users.map((user) => (user.id === record.id ? { ...user, isBanned: true } : user)),
            );
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };

  const onUnban = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to un-ban this user',
      okText: 'Yes, Un-ban',
      onOk: () => {
        setLoading(true);
        request(`/api/user/${record.id}/restore`, 'PUT')
          .then(async () => {
            setUsers(
              users.map((user) => (user.id === record.id ? { ...user, isBanned: false } : user)),
            );
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };

  const onDrawerClose = () => {
    setSiderProps({});
    setDrawer(false);
  };
  const onDrawerOpen = (record_) => {
    const record = { ...record_, access: { ...defaultPermissions, ...record_.access } };

    setSiderProps({
      title: `${record.username}'s Permissions`,
      data: record,
    });

    setDownloadState(record.access['download']);
    setLabourersState(record.access['labourers']);
    setAgentsState(record.access['agents']);
    setFactoryOwnersState(record.access['factoryOwners']);
    setJobApplicationsState(record.access['jobApplications']);
    setJobPostsState(record.access['jobPosts']);
    setNotification(record.access['notification']);
    setAdminAccess(record.access['adminAccess']);
    setDrawer(true);
  };

  const onEditModalClose = () => {
    setEditModalVisiblity(false);
    setEditData({});
  };

  const editModalSave = () => {
    setLoading(true);
    setEditModalVisiblity(false);

    request(`/api/user/${editData.id}`, 'PUT', {
      data: editData,
    })
      .then(async () => {
        setUsers(users.map((user) => (user.id === editData.id ? editData : user)));
        setLoading(false);
        setEditData({});
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const updatePermissions = () => {
    setLoading(true);
    setDisableUpdatePermissionButton(false);
    const access = {
      access: {
        download: downloadState,
        agents: agentsState,
        labourers: labourersState,
        factoryOwners: factoryOwnersState,
        jobApplications: jobApplicationsState,
        jobPosts: jobPostsState,
        notification,
        adminAccess,
      },
    };

    request(`/api/user/${siderProps.data.id}`, 'PUT', {
      data: access,
    })
      .then(async () => {
        setUsers(
          users.map((user) =>
            user.id === siderProps.data.id ? { ...user, access: access.access } : user,
          ),
        );
        message.success('Permissions Updated.');
        setDisableUpdatePermissionButton(true);
        setLoading(false);
      })
      .catch(() => {
        setDisableUpdatePermissionButton(true);
        setLoading(false);
      });
  };

  const permissionChangeHandler = (prevState, index) => {
    const newState = [...prevState];
    newState[index] = !prevState[index];
    return newState;
  };

  const cols = [
    {
      key: 1,
      title: 'Userame',
      dataIndex: 'username',
    },
    {
      key: 2,
      title: 'Contact',
      dataIndex: 'phoneNo',
    },
    {
      key: 3,
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 4,
      title: 'Action',
      render: (record) => (
        <>
          <EyeOutlined
            style={innerTableActionBtnDesign}
            onClick={() => {
              onDrawerOpen(record);
            }}
          />
          <EditOutlined style={innerTableActionBtnDesign} onClick={() => onEdit(record)} />
          {record.isBanned ? (
            <LoginOutlined style={innerTableActionBtnDesign} onClick={() => onUnban(record)} />
          ) : (
            <DeleteOutlined style={innerTableActionBtnDesign} onClick={() => onDelete(record)} />
          )}
        </>
      ),
    },
  ];
  const actionBtn = [
    <Button type="primary" onClick={fetchData}>
      <ReloadOutlined />
    </Button>,
    userContext.access['adminAccess'][0] ? (
      <Button className="w-44" type="primary" onClick={onAddUser}>
        Create User
      </Button>
    ) : null,
  ];
  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Admin"
      actions={actionBtn}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Users" key="1">
          <DataTable searchable usersData={users} differRows loading={loading} columns={cols} />
          <Drawer
            title={siderProps.title}
            width="750px"
            placement="right"
            onClose={onDrawerClose}
            visible={drawer}
          >
            <Row width="100%">
              <DataTable
                className="w-max"
                minWidth="100%"
                pagination={false}
                searchable={false}
                loading={loading}
                columns={[
                  {
                    key: 1,
                    title: 'Actions',
                    dataIndex: 'action',
                  },
                  {
                    key: 2,
                    title: 'Create',
                    render: (record) => (
                      <>
                        <Switch
                          onChange={() => {
                            if (record.key === 1)
                              setDownloadState((prevState) =>
                                permissionChangeHandler(prevState, 0),
                              );
                            else if (record.key === 2)
                              setLabourersState((prevState) =>
                                permissionChangeHandler(prevState, 0),
                              );
                            else if (record.key === 3)
                              setAgentsState((prevState) => permissionChangeHandler(prevState, 0));
                            else if (record.key === 4)
                              setFactoryOwnersState((prevState) =>
                                permissionChangeHandler(prevState, 0),
                              );
                            else if (record.key === 5)
                              setJobPostsState((prevState) =>
                                permissionChangeHandler(prevState, 0),
                              );
                            else if (record.key === 6)
                              setJobApplicationsState((prevState) =>
                                permissionChangeHandler(prevState, 0),
                              );
                            else if (record.key === 7)
                              setNotification((prevState) => permissionChangeHandler(prevState, 0));
                            else if (record.key === 8)
                              setAdminAccess((prevState) => permissionChangeHandler(prevState, 0));
                          }}
                          checked={
                            record.key === 1
                              ? downloadState[0]
                              : record.key === 2
                              ? labourersState[0]
                              : record.key === 3
                              ? agentsState[0]
                              : record.key === 4
                              ? factoryOwnersState[0]
                              : record.key === 5
                              ? jobPostsState[0]
                              : record.key === 6
                              ? jobApplicationsState[0]
                              : record.key === 7
                              ? notification[0]
                              : adminAccess[0]
                          }
                        />
                      </>
                    ),
                  },
                  {
                    key: 3,
                    title: 'Read',
                    render: (record) => (
                      <>
                        <Switch
                          onChange={() => {
                            if (record.key === 1)
                              setDownloadState((prevState) =>
                                permissionChangeHandler(prevState, 1),
                              );
                            else if (record.key === 2)
                              setLabourersState((prevState) =>
                                permissionChangeHandler(prevState, 1),
                              );
                            else if (record.key === 3)
                              setAgentsState((prevState) => permissionChangeHandler(prevState, 1));
                            else if (record.key === 4)
                              setFactoryOwnersState((prevState) =>
                                permissionChangeHandler(prevState, 1),
                              );
                            else if (record.key === 5)
                              setJobPostsState((prevState) =>
                                permissionChangeHandler(prevState, 1),
                              );
                            else if (record.key === 6)
                              setJobApplicationsState((prevState) =>
                                permissionChangeHandler(prevState, 1),
                              );
                            else if (record.key === 7)
                              setNotification((prevState) => permissionChangeHandler(prevState, 1));
                            else if (record.key === 8)
                              setAdminAccess((prevState) => permissionChangeHandler(prevState, 1));
                          }}
                          checked={
                            record.key === 1
                              ? downloadState[1]
                              : record.key === 2
                              ? labourersState[1]
                              : record.key === 3
                              ? agentsState[1]
                              : record.key === 4
                              ? factoryOwnersState[1]
                              : record.key === 5
                              ? jobPostsState[1]
                              : record.key === 6
                              ? jobApplicationsState[1]
                              : record.key === 7
                              ? notification[1]
                              : adminAccess[1]
                          }
                        />
                      </>
                    ),
                  },
                  {
                    key: 4,
                    title: 'Update',
                    render: (record) => (
                      <>
                        <Switch
                          disabled={record.key === 7 || record.key === 8}
                          onChange={() => {
                            if (record.key === 1)
                              setDownloadState((prevState) =>
                                permissionChangeHandler(prevState, 2),
                              );
                            else if (record.key === 2)
                              setLabourersState((prevState) =>
                                permissionChangeHandler(prevState, 2),
                              );
                            else if (record.key === 3)
                              setAgentsState((prevState) => permissionChangeHandler(prevState, 2));
                            else if (record.key === 4)
                              setFactoryOwnersState((prevState) =>
                                permissionChangeHandler(prevState, 2),
                              );
                            else if (record.key === 5)
                              setJobPostsState((prevState) =>
                                permissionChangeHandler(prevState, 2),
                              );
                            else
                              setJobApplicationsState((prevState) =>
                                permissionChangeHandler(prevState, 2),
                              );
                          }}
                          checked={
                            record.key === 1
                              ? downloadState[2]
                              : record.key === 2
                              ? labourersState[2]
                              : record.key === 3
                              ? agentsState[2]
                              : record.key === 4
                              ? factoryOwnersState[2]
                              : record.key === 5
                              ? jobPostsState[2]
                              : jobApplicationsState[2]
                          }
                        />
                      </>
                    ),
                  },
                  {
                    key: 5,
                    title: 'Delete',
                    render: (record) => (
                      <>
                        <Switch
                          disabled={record.key === 7 || record.key === 8}
                          onChange={() => {
                            if (record.key === 1)
                              setDownloadState((prevState) =>
                                permissionChangeHandler(prevState, 3),
                              );
                            else if (record.key === 2)
                              setLabourersState((prevState) =>
                                permissionChangeHandler(prevState, 3),
                              );
                            else if (record.key === 3)
                              setAgentsState((prevState) => permissionChangeHandler(prevState, 3));
                            else if (record.key === 4)
                              setFactoryOwnersState((prevState) =>
                                permissionChangeHandler(prevState, 3),
                              );
                            else if (record.key === 5)
                              setJobPostsState((prevState) =>
                                permissionChangeHandler(prevState, 3),
                              );
                            else
                              setJobApplicationsState((prevState) =>
                                permissionChangeHandler(prevState, 3),
                              );
                          }}
                          checked={
                            record.key === 1
                              ? downloadState[3]
                              : record.key === 2
                              ? labourersState[3]
                              : record.key === 3
                              ? agentsState[3]
                              : record.key === 4
                              ? factoryOwnersState[3]
                              : record.key === 5
                              ? jobPostsState[3]
                              : jobApplicationsState[3]
                          }
                        />
                      </>
                    ),
                  },
                ]}
                usersData={[
                  {
                    key: 1,
                    action: 'Download',
                    create: downloadState[0],
                    read: downloadState[1],
                    update: downloadState[2],
                    delete: downloadState[3],
                  },
                  {
                    key: 2,
                    action: 'Labourers',
                    create: labourersState[0],
                    read: labourersState[1],
                    update: labourersState[2],
                    delete: labourersState[3],
                  },
                  {
                    key: 3,
                    action: 'Agents',
                    create: agentsState[0],
                    read: agentsState[1],
                    update: agentsState[2],
                    delete: agentsState[3],
                  },

                  {
                    key: 4,
                    action: 'Factory Owners',
                    create: factoryOwnersState[0],
                    read: factoryOwnersState[1],
                    update: factoryOwnersState[2],
                    delete: factoryOwnersState[3],
                  },

                  {
                    key: 5,
                    action: 'Job Posts',
                    create: jobPostsState[0],
                    read: jobPostsState[1],
                    update: jobPostsState[2],
                    delete: jobPostsState[3],
                  },

                  {
                    key: 6,
                    action: 'Job Applications',
                    create: jobApplicationsState[0],
                    read: jobApplicationsState[1],
                    update: jobApplicationsState[2],
                    delete: jobApplicationsState[3],
                  },
                  {
                    key: 7,
                    action: 'Notifications',
                    create: notification ? notification[0] : false,
                    read: notification ? notification[1] : false,
                  },
                  {
                    key: 8,
                    action: 'Admin',
                    create: adminAccess ? adminAccess[0] : false,
                    read: adminAccess ? adminAccess[1] : false,
                  },
                ]}
              />
            </Row>
            <Row className="p-4">
              <Button
                onClick={updatePermissions}
                type="primary"
                disabled={!disableUpdatePermissionButton}
              >
                Update Permissions
              </Button>
            </Row>
          </Drawer>
          <Modal
            title="Edit User"
            visible={editModalVisiblity}
            onCancel={onEditModalClose}
            onOk={editModalSave}
            okText="Update Sub-Admin"
          >
            <Form.Item label="Username">
              <Input
                title="Username "
                value={editData.username}
                onChange={(e) => {
                  setEditData({ ...editData, username: e.target.value });
                }}
                placeholder="Enter username"
                required
              />
            </Form.Item>

            <Form.Item label="Contact">
              <Input
                title="contact "
                value={editData.phoneNo}
                onChange={(e) => {
                  setEditData({ ...editData, phoneNo: e.target.value });
                }}
                placeholder="Enter Contact"
                required
              />
            </Form.Item>

            <Form.Item label="Email">
              <Input
                title="Email "
                value={editData.email}
                onChange={(e) => {
                  setEditData({ ...editData, email: e.target.value });
                }}
                placeholder="Enter E-mail"
                required
              />
            </Form.Item>
          </Modal>

          <Modal
            width={750}
            title="Add User"
            visible={addUserModalVisiblity}
            onCancel={setAllStatesToDefault}
            onOk={onAddUserSave}
          >
            <Row gutter={24}>
              <Col span={12} lg={12} md={12} sm={24} xs={24} className="">
                <label>Username </label>
                <Input
                  title="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </Col>
              <Col span={12} lg={12} md={12} sm={24} xs={24} className="">
                <label>Password</label>
                <Input.Password
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Col>
              <Col span={24} lg={24} md={24} sm={24} xs={24} className="py-2">
                <label htmlFor=""> Phone Number</label>
                <Input
                  title="phoneNo"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  placeholder="Enter Phone Number"
                />
              </Col>
              <Col span={24} lg={24} md={24} sm={24} xs={24}>
                <DataTable
                  pagination={false}
                  columns={[
                    {
                      key: 1,
                      title: 'Actions',
                      dataIndex: 'action',
                    },
                    {
                      key: 2,
                      title: 'Create',
                      render: (record) => (
                        <>
                          {console.log(record)}
                          <Switch
                            onChange={() => {
                              if (record.key === 1)
                                setDownloadState((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                              else if (record.key === 2)
                                setLabourersState((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                              else if (record.key === 3)
                                setAgentsState((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                              else if (record.key === 4)
                                setFactoryOwnersState((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                              else if (record.key === 5)
                                setJobPostsState((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                              else if (record.key === 6)
                                setJobApplicationsState((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                              else if (record.key === 7)
                                setNotification((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                              else if (record.key === 8)
                                setAdminAccess((prevState) =>
                                  permissionChangeHandler(prevState, 0),
                                );
                            }}
                            checked={
                              record.key === 1
                                ? downloadState[0]
                                : record.key === 2
                                ? labourersState[0]
                                : record.key === 3
                                ? agentsState[0]
                                : record.key === 4
                                ? factoryOwnersState[0]
                                : record.key === 5
                                ? jobPostsState[0]
                                : record.key === 6
                                ? jobApplicationsState[0]
                                : record.key === 7
                                ? notification[0]
                                : adminAccess[0]
                            }
                          />
                        </>
                      ),
                    },
                    {
                      key: 3,
                      title: 'Read',
                      render: (record) => (
                        <>
                          <Switch
                            onChange={() => {
                              if (record.key === 1)
                                setDownloadState((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                              else if (record.key === 2)
                                setLabourersState((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                              else if (record.key === 3)
                                setAgentsState((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                              else if (record.key === 4)
                                setFactoryOwnersState((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                              else if (record.key === 5)
                                setJobPostsState((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                              else if (record.key === 6)
                                setJobApplicationsState((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                              else if (record.key === 7)
                                setNotification((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                              else if (record.key === 8)
                                setAdminAccess((prevState) =>
                                  permissionChangeHandler(prevState, 1),
                                );
                            }}
                            checked={
                              record.key === 1
                                ? downloadState[1]
                                : record.key === 2
                                ? labourersState[1]
                                : record.key === 3
                                ? agentsState[1]
                                : record.key === 4
                                ? factoryOwnersState[1]
                                : record.key === 5
                                ? jobPostsState[1]
                                : record.key === 6
                                ? jobApplicationsState[1]
                                : record.key === 7
                                ? notification[1]
                                : adminAccess[1]
                            }
                          />
                        </>
                      ),
                    },
                    {
                      key: 4,
                      title: 'Update',
                      render: (record) => (
                        <>
                          <Switch
                            disabled={record.key === 7 || record.key === 8}
                            onChange={() => {
                              if (record.key === 1)
                                setDownloadState((prevState) =>
                                  permissionChangeHandler(prevState, 2),
                                );
                              else if (record.key === 2)
                                setLabourersState((prevState) =>
                                  permissionChangeHandler(prevState, 2),
                                );
                              else if (record.key === 3)
                                setAgentsState((prevState) =>
                                  permissionChangeHandler(prevState, 2),
                                );
                              else if (record.key === 4)
                                setFactoryOwnersState((prevState) =>
                                  permissionChangeHandler(prevState, 2),
                                );
                              else if (record.key === 5)
                                setJobPostsState((prevState) =>
                                  permissionChangeHandler(prevState, 2),
                                );
                              else
                                setJobApplicationsState((prevState) =>
                                  permissionChangeHandler(prevState, 2),
                                );
                            }}
                            checked={
                              record.key === 1
                                ? downloadState[2]
                                : record.key === 2
                                ? labourersState[2]
                                : record.key === 3
                                ? agentsState[2]
                                : record.key === 4
                                ? factoryOwnersState[2]
                                : record.key === 5
                                ? jobPostsState[2]
                                : jobApplicationsState[2]
                            }
                          />
                        </>
                      ),
                    },
                    {
                      key: 5,
                      title: 'Delete',
                      render: (record) => (
                        <>
                          <Switch
                            disabled={record.key === 7 || record.key === 8}
                            onChange={() => {
                              if (record.key === 1)
                                setDownloadState((prevState) =>
                                  permissionChangeHandler(prevState, 3),
                                );
                              else if (record.key === 2)
                                setLabourersState((prevState) =>
                                  permissionChangeHandler(prevState, 3),
                                );
                              else if (record.key === 3)
                                setAgentsState((prevState) =>
                                  permissionChangeHandler(prevState, 3),
                                );
                              else if (record.key === 4)
                                setFactoryOwnersState((prevState) =>
                                  permissionChangeHandler(prevState, 3),
                                );
                              else if (record.key === 5)
                                setJobPostsState((prevState) =>
                                  permissionChangeHandler(prevState, 3),
                                );
                              else
                                setJobApplicationsState((prevState) =>
                                  permissionChangeHandler(prevState, 3),
                                );
                            }}
                            checked={
                              record.key === 1
                                ? downloadState[3]
                                : record.key === 2
                                ? labourersState[3]
                                : record.key === 3
                                ? agentsState[3]
                                : record.key === 4
                                ? factoryOwnersState[3]
                                : record.key === 5
                                ? jobPostsState[3]
                                : jobApplicationsState[3]
                            }
                          />
                        </>
                      ),
                    },
                  ]}
                  usersData={[
                    {
                      key: 1,
                      action: 'Download',
                      create: downloadState[0],
                      read: downloadState[1],
                      update: downloadState[2],
                      delete: downloadState[3],
                    },
                    {
                      key: 2,
                      action: 'Labourers',
                      create: labourersState[0],
                      read: labourersState[1],
                      update: labourersState[2],
                      delete: labourersState[3],
                    },
                    {
                      key: 3,
                      action: 'Agents',
                      create: agentsState[0],
                      read: agentsState[1],
                      update: agentsState[2],
                      delete: agentsState[3],
                    },

                    {
                      key: 4,
                      action: 'Factory Owners',
                      create: factoryOwnersState[0],
                      read: factoryOwnersState[1],
                      update: factoryOwnersState[2],
                      delete: factoryOwnersState[3],
                    },

                    {
                      key: 5,
                      action: 'Job Posts',
                      create: jobPostsState[0],
                      read: jobPostsState[1],
                      update: jobPostsState[2],
                      delete: jobPostsState[3],
                    },

                    {
                      key: 6,
                      action: 'Job Applications',
                      create: jobApplicationsState[0],
                      read: jobApplicationsState[1],
                      update: jobApplicationsState[2],
                      delete: jobApplicationsState[3],
                    },
                    {
                      key: 7,
                      action: 'Notifications',
                      create: notification[0],
                      read: notification[1],
                    },
                    {
                      key: 8,
                      action: 'Admin',
                      create: adminAccess[0],
                      read: adminAccess[1],
                    },
                  ]}
                />
              </Col>
            </Row>
          </Modal>
        </TabPane>
        <TabPane key="2" tab="Trash">
          <Alert
            type="warning"
            message="Users in trash will be removed automatically after 30 days"
            showIcon
          />
        </TabPane>
      </Tabs>
    </HCLayout>
  );
};

export { Admin };
