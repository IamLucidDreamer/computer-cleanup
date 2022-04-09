/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Tooltip,
  Form,
  Input,
  Modal,
  Image,
  Col,
  // Badge,
  Drawer,
  Tabs,
  Switch,
  Row,
  Alert,
  Radio,
  message,
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
  SearchOutlined,
  CloseOutlined,
  BellOutlined,
  ReloadOutlined,
  // LoginOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import QS from 'query-string';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { HCLayout } from './Layout/HCLayout';
import { DataTable } from './Table/Table';
import { Desc } from './Common/Description';
import { request } from '../service/common';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';
import { AuthContext } from '../context/Authcontext';

const MiddleMan = () => {
  const { TextArea } = Input;
  const { TabPane } = Tabs;
  const [middleman, setMiddleman] = useState([]);

  const [loading, setLoading] = useState(true);

  const [drawer, setDrawer] = useState(false);

  const [siderProps, setSiderProps] = useState({});

  const [editData, setEditData] = useState({});

  const [editModalVisiblity, setEditModalVisiblity] = useState(false);

  const [title, setTitle] = useState('');

  const [body, setBody] = useState('');

  const [totalMiddlemen, setTotalMiddlemen] = useState(0);
  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const [filters, setFilters] = useState({});

  const [bannedMiddlemen, setBannedMiddlemen] = useState(0);

  const [trashAgents, setTrashAgents] = useState([]);

  const [showTrash, setShowTrash] = useState(false);

  const [mmLabours, setMmLabours] = useState(0);

  const [disableNotificationButton, setDisableNotificationButton] = useState(true);

  const [allMiddleman, setAllMiddleMan] = useState([]);
  const [customNotificationModal, setCustomNotificationModal] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedTempIds, setSelectedTempIds] = useState([]);

  const { userContext } = useContext(AuthContext);

  const refreshTable = (queryString) => {
    setLoading(true);

    request(`/api/app-user/users/MiddleMan?${queryString}`, 'GET')
      .then(async (data) => {
        // eslint-disable-next-line array-callback-return
        data.map((item) => {
          item.key = item.id;
        });

        setMiddleman(data);

        setLoading(false);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => setLoading(false));
  };

  const requestsCaller = () => {
    setLoading(true);

    request(`/api/app-user/users/MiddleMan`, 'GET')
      .then(async (data) => {
        // eslint-disable-next-line no-return-assign
        // eslint-disable-next-line array-callback-return
        data.map((item) => {
          item.key = item.id;
        });
        setMiddleman(data);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  useEffect(() => {
    if (isFilterChanged) {
      refreshTable(QS.stringify(filters));
      setIsFilterChanged(false);
    }
  }, [isFilterChanged]);

  const onTableFilterChange = (query) => {
    setFilters({ ...filters, ...query });
  };

  const clearFilter = (type) => {
    setFilters({ ...filters, [type]: undefined, direction: undefined, lastRecordId: undefined });
    setIsFilterChanged(true);
  };

  const setFilterChange = () => {
    setIsFilterChanged(true);
    // setFilters({ ...filters, isChanged: true });
  };

  const getTrash = (val) => {
    setShowTrash(val);
    onTableFilterChange({ isBanned: val, direction: undefined, lastRecordId: undefined });
    if (val) {
      setFilterChange();
    } else {
      clearFilter('isBanned');
    }
  };

  const getAllMiddleman = () => {
    request('/api/getAll/middlemen', 'GET')
      .then((data) => setAllMiddleMan(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    requestsCaller();
    getAllMiddleman();

    request(`/api/count/middlemen`, 'GET')
      .then(async (data) => {
        setTotalMiddlemen(data.totalMiddlemen);
        setMmLabours(data.totalMiddlemanLabourers);
        setBannedMiddlemen(data.bannedMiddlemen);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  const finalDelete = (record) => {
    Modal.confirm({
      title: 'This action is not reversable',
      icon: <ExclamationOutlined />,
      content: 'Please be careful while deleteting permanently. this action is undoable',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user/delete?userId=${record.userId}`, 'DELETE')
          .then((data) => {
            setMiddleman(middleman.filter((mMan) => mMan.userId !== record.userId));
            setLoading(false);
          })
          .catch((err) => console.log(err));
      },
      okText: 'Delete',
    });
  };

  const rowSelection = {
    columnTitle: <div />,

    onChange: (keys, selectedRows) => {
      const temp = [];
      selectedRows.map((row) => temp.push(row.userId));
      setSelectedTempIds(temp);
    },
  };

  const notificationModal = () => {
    setCustomNotificationModal(true);
    setSelectedIds([...selectedIds, ...selectedTempIds]);
    setSelectedTempIds([]);
  };

  const sendingNotification = (values) => {
    values.users = selectedIds;
    values.timeStamp = new Date().toJSON();

    setLoading(true);

    request(`/api/notification/custom-users`, 'POST', {
      data: values,
    })
      .then(async () => {
        setCustomNotificationModal(false);
        setLoading(false);
        message.success('Notification Sent');
      })
      .catch((err) => {
        setCustomNotificationModal(false);
        setLoading(false);
        throw err;
      });
  };

  const actionBtn = [
    <Row gutter={16}>
      <Col>
        <div style={{ paddingTop: 5 }}>
          Trash: &nbsp;
          <Switch defaultChecked={showTrash} onChange={getTrash} />
        </div>
      </Col>

      <Col>
        <Button type="primary" onClick={() => requestsCaller()}>
          <ReloadOutlined />
        </Button>
      </Col>
      <Col>
        <Button
          disabled={selectedIds.length === 0 && selectedTempIds.length === 0}
          type="primary"
          onClick={() => notificationModal()}
        >
          <BellOutlined /> Send Notification{' '}
          {selectedTempIds.length !== 0 || selectedIds.length !== 0
            ? `(${selectedIds.length + selectedTempIds.length})`
            : null}
        </Button>
      </Col>
      <Col>
        {userContext.access['download'][0] ? (
          <Button className="w-44" type="primary" style={{ border: 'none' }}>
            <CSVLink
              filename="Agents.csv"
              data={allMiddleman.map((middleman) => {
                const updatedMiddleman = { ...middleman };
                updatedMiddleman.gender = updatedMiddleman.gender === 1 ? 'Male' : 'Female';
                updatedMiddleman.locale =
                  updatedMiddleman.locale === 3
                    ? 'ta'
                    : updatedMiddleman.locale === 2
                    ? 'hi'
                    : 'en';
                updatedMiddleman.phone = `=""`.concat(updatedMiddleman.phone, `""`);
                updatedMiddleman.initialNoOfLabourers =
                  updatedMiddleman.middleman?.initialNoOfLabourers;
                updatedMiddleman.states = updatedMiddleman.middleman?.states;
                if (updatedMiddleman.bankDetails !== undefined) {
                  if (updatedMiddleman.bankDetails?.aadhaarNo)
                    updatedMiddleman.aadhaarNo = `=""`.concat(
                      updatedMiddleman.bankDetails?.aadhaarNo,
                      `""`,
                    );
                  if (updatedMiddleman.bankDetails?.bankAccountNo)
                    updatedMiddleman.bankAccountNo = `=""`.concat(
                      updatedMiddleman.bankDetails?.bankAccountNo,
                      `""`,
                    );
                  if (updatedMiddleman.bankDetails?.ifscCode)
                    updatedMiddleman.ifscCode = updatedMiddleman.bankDetails?.ifscCode;
                  if (updatedMiddleman.bankDetails?.backAadhaarPhoto)
                    updatedMiddleman.backAadhaarPhoto =
                      updatedMiddleman.bankDetails?.backAadhaarPhoto;
                  if (updatedMiddleman.bankDetails?.frontAadhaarPhoto)
                    updatedMiddleman.frontAadhaarPhoto =
                      updatedMiddleman.bankDetails?.frontAadhaarPhoto;
                }
                updatedMiddleman.isBanned = !updatedMiddleman.isBanned ? 'false' : 'true';
                delete updatedMiddleman.id;
                delete updatedMiddleman.role;
                delete updatedMiddleman.middleman;
                delete updatedMiddleman.bankDetails;
                return updatedMiddleman;
              })}
              onClick={() => {
                message.success('The file is downloading');
              }}
              className="w-44"
            >
              Export to CSV
            </CSVLink>
          </Button>
        ) : null}
      </Col>
    </Row>,
  ];

  const onEdit = (record) => {
    setEditModalVisiblity(true);
    setEditData(record);
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to Ban this agent',
      okText: 'Yes, Ban',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user?userId=${record.userId}`, 'DELETE')
          .then(async () => {
            setMiddleman(
              middleman.map((middleman) =>
                middleman.id === record.id
                  ? { ...middleman, userInfo: { ...middleman.userInfo, isBanned: true } }
                  : middleman,
              ),
            );
            record.userInfo.isBanned = true;
            setTrashAgents([...trashAgents, record]);
            setBannedMiddlemen(bannedMiddlemen + 1);
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
      title: 'Are you sure, you want to un-ban this agent',
      okText: 'Yes, Un-ban',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user/restore?userId=${record.userId}`, 'PATCH')
          .then(async () => {
            setMiddleman(
              middleman.map((middleman) =>
                middleman.id === record.id
                  ? { ...middleman, userInfo: { ...middleman.userInfo, isBanned: false } }
                  : middleman,
              ),
            );
            setTrashAgents(trashAgents.filter((agent) => agent.id !== record.id));

            setBannedMiddlemen(bannedMiddlemen - 1);
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

  const onDrawerOpen = (record) => {
    setSiderProps({
      title: `${record.userInfo?.name}'s Information`,
      data: record,
    });
    setDrawer(true);
  };

  const onEditModalClose = () => {
    setEditModalVisiblity(false);
    setEditData({});
  };

  const editModalSave = () => {
    setLoading(true);
    setEditModalVisiblity(false);
    request(`/api/app-user?userId=${editData.userId}`, 'PATCH', {
      data: {
        name: editData.userInfo.name,
        gender: editData.userInfo.gender.toString(),
        age: editData.userInfo.age,
      },
    })
      .then(async () => {
        setMiddleman(
          middleman.map((middleman) => (middleman.id === editData.id ? editData : middleman)),
        );
        setLoading(false);
        setEditData({});
      })
      .catch((err) => {
        setLoading(false);
        throw new Error(err);
      });
  };

  const columns = [
    {
      title: 'Name',
      render: (record) => record.userInfo?.name,
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.name}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  name: e.target.value,
                  direction: undefined,
                  lastRecordId: undefined,
                });
              }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => {
                setFilterChange();
              }}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => clearFilter('name')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
    },
    {
      title: 'Phone',
      render: (record) => record.userInfo?.phone,
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.phone}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  phone: e.target.value,
                  direction: undefined,
                  lastRecordId: undefined,
                });
              }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => {
                setFilterChange();
              }}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
          <Col>
            <Button
              onClick={() => clearFilter('phone')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
    },
    {
      title: 'Gender',
      render: (record) => (record.userInfo?.gender === 2 ? 'Female' : 'Male'),
    },
    {
      title: 'Age',
      render: (record) => record.userInfo?.age,
      // sorter: {
      //   compare: (param1, param2) => param1.userInfo?.age - param2.userInfo?.age,
      // },
    },
    {
      title: 'States',
      dataIndex: 'states',
      ellipsis: {
        showTitle: false,
      },
      render: (state) => (
        <Tooltip placement="topLeft" title={state?.join(', ')}>
          {state?.join(', ')}
        </Tooltip>
      ),
    },
    {
      key: 7,
      title: 'Total Labourers',
      render: (record) => (
        <center>
          <Link to={`/agent-labourer?middlemanId=${record.id}`}>
            <LinkOutlined />{' '}
            {record.middlemanLabourers === undefined ? 0 : record.middlemanLabourers.length}
          </Link>
        </center>
      ),
      // sorter: {
      //   compare: (param1, param2) =>
      //     param1.middlemanLabourers.length - param2.middlemanLabourers.length,
      // },
    },
    {
      key: 'createAt',
      title: 'Reg. Date',
      render: (record) => (
        <Tooltip
          placement="top"
          title={`${new Date(record.userInfo?.createdAt).toLocaleDateString()} ${new Date(
            record.userInfo?.createdAt,
          ).toLocaleTimeString()}`}
        >
          {`${new Date(record.userInfo?.createdAt).toLocaleDateString()}`}
        </Tooltip>
      ),
    },
    {
      key: 8,
      title: 'Action',
      render: (record) => (
        <>
          <EyeOutlined
            style={innerTableActionBtnDesign}
            onClick={() => {
              onDrawerOpen(record);
            }}
          />
          {userContext.access['agents'][2] ? (
            <EditOutlined style={innerTableActionBtnDesign} onClick={() => onEdit(record)} />
          ) : null}
          {record.userInfo?.isBanned === true ? (
            <ReloadOutlined style={innerTableActionBtnDesign} onClick={() => onUnban(record)} />
          ) : userContext.access['agents'][3] ? (
            <DeleteOutlined style={innerTableActionBtnDesign} onClick={() => onDelete(record)} />
          ) : null}
          {showTrash ? (
            <DeleteOutlined
              title="Delete Permanently"
              style={innerTableActionBtnDesign}
              onClick={() => finalDelete(record)}
            />
          ) : null}
        </>
      ),
    },
  ];

  const data = siderProps.data || {};
  const states = data.states || [];

  const paginationHandler = (direction, lastRecordId) => {
    onTableFilterChange({
      direction,
      lastRecordId,
    });
    setFilterChange();
    setSelectedIds([...selectedIds, ...selectedTempIds]);
    setSelectedTempIds([]);
  };

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Agents"
      actions={actionBtn}
    >
      <Row gutter={24} className="p-3">
        <Col span={8} xs={24} md={8} sm={12} lg={8} className="gutter-row ">
          <div className="tileStyle">
            <h2>Total Agents</h2>
            <span>{totalMiddlemen}</span>
          </div>
        </Col>
        <Col span={8} xs={24} md={8} sm={12} lg={8} className="gutter-row">
          <div className="tileStyle">
            <h2>Total Labourers Under Agents</h2>
            <span>{mmLabours}</span>
          </div>
        </Col>
        <Col xs={24} md={8} sm={12} lg={8}>
          <div className="tileStyle">
            <h2>Banned Agents</h2>
            <span>{bannedMiddlemen}</span>
          </div>
        </Col>
      </Row>
      {showTrash ? (
        <Alert
          type="warning"
          message="Agents in trash will be removed automatically after 30 days"
          showIcon
        />
      ) : null}
      <DataTable
        usersData={middleman}
        differUserRows
        pagination={false}
        rowSelection={rowSelection}
        loading={loading}
        columns={columns}
      />
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button
            type="primary"
            onClick={() => paginationHandler('b', middleman[0].id)}
            title="Prev"
          >
            Prev
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => paginationHandler('f', middleman[middleman.length - 1].id)}
            title="Next"
          >
            Next
          </Button>
        </Col>
      </Row>
      <Drawer
        title={siderProps.title}
        width="750px"
        placement="right"
        onClose={onDrawerClose}
        visible={drawer}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Agent Information" key="1">
            <Row>
              <Col span={12} lg={12} md={12} sm={24} xs={24}>
                <Desc title="Name" content={data.userInfo?.name} />
                <Desc title="Phone" content={data.userInfo?.phone} />
                <Desc title="Age" content={data.userInfo?.age} />
                <Desc title="Gender" content={data.userInfo?.gender === 2 ? `Female` : 'Male'} />
                <Desc title="States" content={states.map((item) => `${item}, `)} />
              </Col>
              <Col span={12} lg={12} md={12} sm={24} xs={24}>
                <Desc title="Aadhaar No." content={data.userInfo?.bankDetails?.aadhaarNo} />
                <Desc title="Account No." content={data.userInfo?.bankDetails?.bankAccountNo} />
                <Desc title="IFSC" content={data.userInfo?.bankDetails?.ifscCode} />
                <Desc
                  title="Locale"
                  content={
                    data.userInfo?.locale === 3 ? 'ta' : data.userInfo?.locale === 2 ? 'hi' : 'en'
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={8} lg={8} md={12} sm={24} xs={24} className="p-3 mt-3">
                <h2>
                  <b>Profile Image : </b>
                </h2>
                <Image src={data.userInfo?.imageUrl} preview={false} alt="Not Available" />
              </Col>

              <Col span={8} lg={8} md={12} sm={24} xs={24} className="p-3 mt-3">
                <h2>
                  <b>Aadhaar Front : </b>
                </h2>
                <Image
                  src={data.userInfo?.bankDetails?.frontAadhaarPhoto}
                  preview={false}
                  alt="Not Available"
                />
              </Col>

              <Col span={8} lg={8} md={12} sm={24} xs={24} className="p-3 mt-3">
                <h2>
                  <b>Aadhaar Back : </b>
                </h2>
                <Image
                  src={data.userInfo?.bankDetails?.backAadhaarPhoto}
                  preview={false}
                  alt="Not Available"
                />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Drawer>
      <Modal
        title="Edit Agent"
        visible={editModalVisiblity}
        onCancel={onEditModalClose}
        onOk={editModalSave}
        okText="Update Agent Info"
      >
        <Form.Item label="Agent Name">
          <Input
            title="Name "
            value={editData.userInfo?.name}
            onChange={(e) => {
              setEditData({
                ...editData,
                userInfo: { ...editData.userInfo, name: e.target.value },
              });
            }}
            placeholder="Enter Agent Name"
            required
          />
        </Form.Item>

        <Form.Item label="Age">
          <Input
            title="Age"
            value={editData.userInfo?.age}
            onChange={(e) => {
              setEditData({
                ...editData,
                userInfo: { ...editData.userInfo, age: e.target.value },
              });
            }}
            placeholder="Enter Age"
            required
          />
        </Form.Item>

        <Form.Item label="Gender">
          <Radio.Group
            onChange={(e) => {
              setEditData({
                ...editData,
                userInfo: { ...editData.userInfo, gender: e.target.value === 'Male' ? 1 : 2 },
              });
            }}
            value={editData.userInfo?.gender === 1 ? 'Male' : 'Female'}
          >
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>

      <Modal
        footer=""
        onCancel={() => setCustomNotificationModal(false)}
        visible={customNotificationModal}
        title="Sending Notification"
      >
        <h2>
          <b> Selected users : {selectedIds.length} </b>
        </h2>
        <Form layout="vertical" onFinish={sendingNotification}>
          <Form.Item
            rules={[{ required: true, message: 'Enter title for notification' }]}
            name="title"
            label="Title"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="body"
            label="Body"
            rules={[{ required: true, message: 'Enter notification body' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send Notification
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </HCLayout>
  );
};

export { MiddleMan };
