/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable dot-notation */
/* eslint-disable no-constant-condition */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect, useContext } from 'react';
import { Tooltip, Modal, Input, Button, Select, Row, Col, Tabs } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { request } from '../service/common';
import { DataTable } from './Table/Table';
import './Layout/style.css';
import { HCLayout } from './Layout/HCLayout';
import { AuthContext } from '../context/Authcontext';

import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
export const Notifications = () => {
  const [notification, setNotification] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalVisibility, setModalVisibility] = useState(false);

  const [title, setTitle] = useState('');

  const [body, setBody] = useState('');

  const [topic, setTopic] = useState('Factory');

  const [customNotificationUsers, setCustomNotificationUsers] = useState([]);

  const [selectedRole, setSelectedRole] = useState('');

  const [recipients, setRecipients] = useState([]);

  const { userContext } = useContext(AuthContext);

  function notifTopic(value) {
    setTopic(value);
  }

  const getUsersForCustomNotification = (value) => {
    setSelectedRole(value);

    request(
      value === 'factory'
        ? '/api/app-user/users/MillOwner'
        : value === 'agent'
        ? '/api/app-user/users/MiddleMan'
        : '/api/app-user/users/Labour',
      'GET',
    )
      .then((data) => {
        setCustomNotificationUsers(data);
      })
      .catch((error) => console.log(error));
  };

  const handleUsers = (value) => {
    setRecipients(value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRecipients('');
  }, [selectedRole]);

  const fetchData = (pageParam) => {
    setLoading(true);
    request(
      pageParam === undefined || pageParam === null
        ? '/api/notification/all'
        : `/api/notification/all${pageParam}`,
      'GET',
    )
      .then(async (data) => {
        setNotification(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const onCreateNotification = () => {
    setModalVisibility(true);
  };

  const cancelNotification = () => {
    setModalVisibility(false);
    setTitle('');
    setBody('');
  };

  const sendCustomNotification = () => {
    setLoading(true);

    const notifData = {
      title,
      body,
      users: recipients,
      timeStamp: new Date().toJSON(),
    };

    console.log(notifData);

    request(`/api/notification/custom-users`, 'POST', { data: notifData })
      .then((data) => {
        console.log(data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const sendNotification = () => {
    setLoading(true);
    const notif = {
      title,
      body,
      timeStamp: new Date().toJSON(),
    };

    request(`/api/notification?topic=${topic}`, 'POST', {
      data: notif,
    })
      .then(async () => {
        setNotification([...notification, { notif }]);
        setModalVisibility(false);
        setLoading(false);
        setTitle('');
        setBody('');
      })
      .catch((err) => {
        setModalVisibility(false);
        setLoading(false);
        setTitle('');
        setBody('');
        throw err;
      });
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete?',
      okText: 'Yes, Delete',
      onOk: () => {
        setLoading(true);

        request(`/api/notification/${record.id}`, 'DELETE')
          .then(async () => {
            setNotification(notification.filter((notif) => record.id !== notif.id));
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };

  const actionBtn = [
    <Button type="primary" onClick={() => fetchData()}>
      <ReloadOutlined />
    </Button>,
    userContext.access['notification'][0] ? (
      <Button type="primary" onClick={onCreateNotification}>
        Create New Notification
      </Button>
    ) : null,
  ];
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Body',
      dataIndex: 'body',
      ellipsis: {
        showTitle: false,
      },
      render: (body) => (
        <Tooltip placement="topLeft" title={body}>
          {body}
        </Tooltip>
      ),
    },
    {
      title: 'To',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <>
          <span>{record.user ? `${record.user.name}(${record.user.phone})` : record.tokenOrTopic} </span>
        </>
      ),
    },
    {
      title: 'Date',
      render: (record) => <span> {record.timeStamp.split('T')[0]}</span>,
    },
    {
      key: 'action',
      title: 'Action',
      render: (record) => (
        <>
          <DeleteOutlined style={innerTableActionBtnDesign} onClick={() => onDelete(record)} />
        </>
      ),
    },
  ];

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Notifications"
      actions={selectedRole !== null ? actionBtn : null}
    >
      <Tabs onChange={(key) => (key === 1 ? setSelectedRole(null) : null)} defaultActiveKey={1}>
        <TabPane tab="Notification" key={1}>
          <DataTable
            usersData={notification}
            loading={loading}
            columns={columns}
            pagination={false}
          />
          <Row gutter={[8, 8]} className="p-5">
            <Col offset={21}>
              <Button
                type="primary"
                onClick={() => fetchData(`?direction=b&lastRecordId=${notification[0].id}`)}
                title="Prev"
              >
                Prev
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() =>
                  fetchData(`?direction=f&lastRecordId=${notification[notification.length - 1].id}`)
                }
                title="Next"
              >
                Next
              </Button>
            </Col>
          </Row>
          <Modal
            title="Send New Custom Notification"
            visible={modalVisibility}
            onCancel={cancelNotification}
            onOk={sendNotification}
          >
            <label>Title : </label>
            <Input
              type="text"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Enter Title"
            />
            <br />
            <br />
            <label>Body : </label>
            <TextArea
              type="text"
              placeholder="Enter Body"
              onChange={(e) => {
                setBody(e.target.value);
              }}
            />
            <br />
            <br />

            <label>Send To :</label>
            <Select defaultValue="Factory" style={{ width: '100%' }} onChange={notifTopic}>
              <Option value="Factory">Mill Owners</Option>
              <Option value="Agent">Agent</Option>
              <Option value="Labour">Labourers</Option>
            </Select>
          </Modal>
        </TabPane>
        <TabPane tab="Custom Notifications" key={2}>
          <label>Select Role : </label> <br />
          <Select onChange={getUsersForCustomNotification} style={{ width: 400 }}>
            <Option value="factory">Factory Owners</Option>
            <Option value="agent">Agents</Option>
            <Option value="/api/app-user/users/Labour">Labourers</Option>
          </Select>
          <br />
          <br />
          {selectedRole ? (
            <>
              <label>Select Users: </label> <br />
              <Select onChange={handleUsers} mode="multiple" style={{ width: 400 }}>
                {customNotificationUsers.map((users) => (
                  <Option key={users.userId} value={users.userId}>
                    {selectedRole === 'factory' ? users.millName : users.userInfo?.name}
                  </Option>
                ))}
              </Select>
              <br />
              <br />
            </>
          ) : null}
          <label>Title : </label> <br />
          <Input
            style={{ width: 400 }}
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Enter Title"
          />
          <br />
          <br />
          <label>Body : </label> <br />
          <TextArea
            style={{ width: 400 }}
            type="text"
            placeholder="Enter Body"
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <br />
          <br />
          <Button onClick={sendCustomNotification} type="primary">
            Send
          </Button>
        </TabPane>
      </Tabs>
    </HCLayout>
  );
};
