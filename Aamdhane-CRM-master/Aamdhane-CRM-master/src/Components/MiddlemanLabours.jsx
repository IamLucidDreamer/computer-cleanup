/* eslint-disable react/jsx-curly-newline */
/* eslint-disable dot-notation */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState, useContext } from 'react';
import {
  Button,
  Radio,
  Input,
  Form,
  Row,
  Col,
  Drawer,
  Modal,
  Image,
  Alert,
  message,
  Switch,
  Tabs,
  Tooltip,
} from 'antd';
import {
  DeleteOutlined,
  CloseOutlined,
  SearchOutlined,
  BellOutlined,
  ReloadOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';

import QS from 'query-string';

import { CSVLink } from 'react-csv';
import { useLocation } from 'react-router-dom';
import { HCLayout } from './Layout/HCLayout';
import { DataTable } from './Table/Table';
import { Desc } from './Common/Description';
import { request } from '../service/common';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';
import { AuthContext } from '../context/Authcontext';
import './Layout/style.css';

const MiddleManLabours = () => {
  const { search } = useLocation();

  const middlemanId = search.split('=')[1];

  const { TabPane } = Tabs;

  // const { TextArea } = Input;

  const [labour, setLabour] = useState([]);

  const [loading, setLoading] = useState(true);

  const [drawer, setDrawer] = useState(false);

  const [siderProps, setSiderProps] = useState({});

  const [employmentInfo, setEmploymentInfo] = useState({});

  const [editData, setEditData] = useState({});
  const [showTrash, setShowTrash] = useState(false);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  const [filters, setFilters] = useState({});
  const [customNotificationModal, setCustomNotificationModal] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedTempIds, setSelectedTempIds] = useState([]);

  const [editModalVisiblity, setEditModalVisiblity] = useState(false);

  const { userContext } = useContext(AuthContext);

  // const [title, setTitle] = useState('');

  const [allLabours, setAllLabours] = useState([]);

  // const [body, setBody] = useState('');

  const [totalLabours, setTotalLabours] = useState(0);

  const [unempLabours, setUnempLabours] = useState(0);

  const [empLabours, setEmpLabours] = useState(0);

  const [bannedLabours, setBannedLabours] = useState(0);

  const [trashAgentLabours, setTrashAgentLabours] = useState([]);

  // const [disableNotificationButton, setDisableNotificationButton] = useState(true);

  const refreshTable = (queryString) => {
    setLoading(true);

    request(`/api/app-user/middleman-labourers?${queryString}`, 'GET')
      .then(async (data) => {
        // eslint-disable-next-line array-callback-return
        data.map((item) => {
          item.key = item.id;
        });

        setLabour(data);

        setLoading(false);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => setLoading(false));
  };

  const requestsCaller = () => {
    setLoading(true);
    let countEmp = 0;
    let countUnEmp = 0;
    let countBanned = 0;
    request(
      middlemanId
        ? `/api/app-user/middleman-labourers?middlemanId=${middlemanId}`
        : `/api/app-user/middleman-labourers`,
      'GET',
    )
      .then(async (data) => {
        // eslint-disable-next-line no-return-assign
        // eslint-disable-next-line array-callback-return
        data.map((item) => {
          item.key = item.id;
          if (item.empStatus) {
            countEmp += 1;
            setEmpLabours(countEmp);
          } else {
            countUnEmp += 1;
            setUnempLabours(countUnEmp);
          }

          if (item.isBanned) {
            countBanned += 1;
            setBannedLabours(countBanned);
          }
        });

        setLabour(data);
        setTotalLabours(data.length);
        setLoading(false);
      })
      .catch((err) => {
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

  const getTrashAgentLabours = () => {
    setLoading(true);
    request(`/api/app-user/middleman-labourers?isBanned=true`, 'GET').then((data) =>
      setTrashAgentLabours(data),
    );
  };

  const getAllLabourData = () => {
    request('/api/getAll/middleman-labourers', 'GET')
      .then((data) => setAllLabours(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    requestsCaller();
    getTrashAgentLabours();
    getAllLabourData();
    request(`/api/count/middleman-labourers`, 'GET')
      .then(async (data) => {
        setTotalLabours(data.totalMiddlemanLabourers);
        setEmpLabours(data.employedMiddlemanLabourers);
        setUnempLabours(data.unemployedMiddlemanLabourers);
        setBannedLabours(data.bannedLabourers);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  const data = siderProps.data || {};

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
              filename="Agent-Labourers.csv"
              data={allLabours.map((labour) => {
                const updatedLabour = { ...labour };
                updatedLabour.expLevel = ``.concat(`${updatedLabour.labour.expLevel} years`);
                updatedLabour.gender = updatedLabour.gender === 1 ? 'Male' : 'Female';
                updatedLabour.locale =
                  updatedLabour.locale === 3 ? 'ta' : updatedLabour.locale === 2 ? 'hi' : 'en';
                updatedLabour.phone = `=""`.concat(updatedLabour.phone, `""`);
                if (updatedLabour.bankDetails !== undefined) {
                  if (updatedLabour.bankDetails?.aadhaarNo)
                    updatedLabour.aadhaarNo = `=""`.concat(
                      updatedLabour.bankDetails?.aadhaarNo,
                      `""`,
                    );
                  if (updatedLabour.bankDetails?.bankAccountNo)
                    updatedLabour.bankAccountNo = `=""`.concat(
                      updatedLabour.bankDetails?.bankAccountNo,
                      `""`,
                    );
                  if (updatedLabour.bankDetails?.ifscCode)
                    updatedLabour.ifscCode = updatedLabour.bankDetails?.ifscCode;
                  if (updatedLabour.bankDetails?.backAadhaarPhoto)
                    updatedLabour.backAadhaarPhoto = updatedLabour.bankDetails?.backAadhaarPhoto;
                  if (updatedLabour.bankDetails?.frontAadhaarPhoto)
                    updatedLabour.frontAadhaarPhoto = updatedLabour.bankDetails?.frontAadhaarPhoto;
                }
                updatedLabour.isBanned = !updatedLabour.isBanned ? 'false' : 'true';
                delete updatedLabour.id;
                delete updatedLabour.labour;
                delete updatedLabour.bankDetails;
                delete updatedLabour.role;
                return updatedLabour;
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

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to Ban this labour',
      okText: 'Yes, Ban',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user?userId=${record.userId}`, 'DELETE')
          .then(async () => {
            setLabour(
              labour.map((labour) =>
                labour.id === record.id
                  ? { ...labour, userInfo: { ...labour.userInfo, isBanned: true } }
                  : labour,
              ),
            );
            record.userInfo.isBanned = true;
            setTrashAgentLabours([...trashAgentLabours, record]);
            setBannedLabours(bannedLabours + 1);
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
      title: 'Are you sure, you want to un-ban this labour',
      okText: 'Yes, Un-ban',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user/restore?userId=${record.userId}`, 'PATCH')
          .then(async () => {
            setLabour(
              labour.map((labour) =>
                labour.id === record.id
                  ? { ...labour, userInfo: { ...labour.userInfo, isBanned: false } }
                  : labour,
              ),
            );
            setTrashAgentLabours(
              trashAgentLabours.filter((agentLabour) => agentLabour.id !== record.id),
            );

            setBannedLabours(bannedLabours - 1);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };
  const finalDelete = (record) => {
    Modal.confirm({
      title: 'This action is not reversable',
      icon: <ExclamationOutlined />,
      content: 'Please be careful while deleteting permanently. this action is undoable',
      onOk: () => {
        setLoading(true);
        request(`/api/app-user/delete?userId=${record.userId}`, 'DELETE')
          .then((data) => {
            setLabour(labour.filter((labr) => labr.userId !== record.userId));
            setLoading(false);
          })
          .catch((err) => console.log(err));
      },
      okText: 'Delete',
    });
  };
  const onDrawerClose = () => {
    setSiderProps({});
    setEmploymentInfo({});
    setDrawer(false);
  };

  const onEditModalClose = () => {
    setEditModalVisiblity(false);
    setEditData({});
  };

  const editModalSave = () => {
    setEditModalVisiblity(false);
    setLoading(true);
    request(`/api/app-user/${editData.id}`, 'PUT', {
      data: editData,
    })
      .then(async () => {
        setLabour(labour.map((item) => (item.id === editData.id ? editData : item)));
        setLoading(false);
        setEditData({});
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const columns = [
    {
      key: 'Name',
      title: 'Name',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.userInfo.name}>
          {record.userInfo.name}
        </Tooltip>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
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
      key: 'Phone',
      title: 'Phone',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.userInfo.phone}>
          {record.userInfo.phone}
        </Tooltip>
      ),
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
      key: 'gender',
      title: 'Gender',
      render: (record) => (record.userInfo.gender === 2 ? 'Female' : 'Male'),
    },
    {
      key: 'Age',
      title: 'Age',
      render: (record) => record.userInfo.age,
    },
    {
      key: 'Agent Name',
      title: 'Agent Name',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.middleman?.userInfo?.name}>
          {record.middleman?.userInfo?.name}
        </Tooltip>
      ),

      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.middlemanName}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  middlemanName: e.target.value,
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
              onClick={() => clearFilter('middlemanName')}
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
      key: 'Agent Phone No',
      title: `Agent's Phone`,
      render: (record) => record.middleman?.userInfo?.phone,
      // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      //   <Row className="p-3 shadow-lg">
      //     <Col>
      //       <Input
      //         placeholder="Search Here"
      //         value={selectedKeys[0]}
      //         autoFocus
      //         onChange={(e) => {
      //           setSelectedKeys(e.target.value ? [e.target.value] : []);
      //           confirm({ closeDropdown: false });
      //         }}
      //         onPressEnter={confirm}
      //         onBlur={confirm}
      //       />
      //     </Col>
      //     <Col>
      //       <Button
      //         onClick={confirm}
      //         icon={<SearchOutlined />}
      //         type="primary"
      //         style={{ borderRadius: 0 }}
      //       />
      //     </Col>
      //   </Row>
      // ),
      // filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      // onFilter: (value, record) => record.middleman?.userInfo?.phone?.includes(value),
    },

    {
      key: 'status',
      title: 'Status',
      render: (record) => (record.empStatus === false ? 'Unemployed' : 'Employed'),
      // filters: [
      //   { text: 'Unemployed', value: 'Unemployed' },
      //   { text: 'Employed', value: 'Employed' },
      // ],
      // onFilter: (value, record) =>
      //   value === 'Unemployed' ? record.empStatus === false : record.empStatus === true,
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
      key: 7,
      title: 'Action',
      render: (record) => (
        <>
          {record.userInfo.isBanned ? (
            <ReloadOutlined style={innerTableActionBtnDesign} onClick={() => onUnban(record)} />
          ) : userContext.access['labourers'][3] ? (
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

  const paginationHandler = (direction, lastRecordId) => {
    onTableFilterChange({
      direction,
      lastRecordId,
    });
    setFilterChange();
    setSelectedIds([...selectedIds, ...selectedTempIds]);
    setSelectedTempIds([]);
  };

  const skillData = data.skills || [];
  return (
    <HCLayout
      onBack={() => {
        window.location.href = middlemanId ? '/agent' : '/';
      }}
      title="Agent's Labourers"
      actions={actionBtn}
    >
      <Row gutter={24} className="p-3">
        <Col span={6} xs={24} md={6} sm={12} lg={6} className="gutter-row ">
          <div className="tileStyle">
            <h2>Total Labourers</h2>
            <span>{totalLabours}</span>
          </div>
        </Col>
        <Col span={6} xs={24} md={6} sm={12} lg={6} className="gutter-row">
          <div className="tileStyle">
            <h2>Unemployed Labourers</h2>
            <span>{unempLabours}</span>
          </div>
        </Col>
        <Col xs={24} md={6} sm={12} lg={6}>
          <div className="tileStyle">
            <h2>Employed Labourers</h2>
            <span>{empLabours}</span>
          </div>
        </Col>
        <Col xs={24} md={6} sm={12} lg={6}>
          <div className="tileStyle">
            <h2>Banned Labourers</h2>
            <span>{bannedLabours}</span>
          </div>
        </Col>
      </Row>
      {showTrash ? (
        <Alert
          type="warning"
          message="Labours in trash will be removed automatically after 30 days"
          showIcon
        />
      ) : null}
      <DataTable
        usersData={labour}
        searchable={false}
        differUserRows
        loading={loading}
        pagination={false}
        rowSelection={rowSelection}
        columns={columns}
      />
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button type="primary" onClick={() => paginationHandler('b', labour[0].id)} title="Prev">
            Prev
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => paginationHandler('f', labour[labour.length - 1].id)}
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
          <TabPane tab="Labour information" key="1">
            <Row>
              <Col span={12} lg={12} md={12} sm={32} xs={32}>
                <Desc title="Name" content={data.name} />
                <Desc title="Phone" content={data.phone} />
                <Desc title="Employment Status" content={data.empStatus} />
                {data.empStatus === 'Employed' ? (
                  <div>
                    <Desc title="Job Title" content={employmentInfo.jobTitle} />
                    <Desc title="Mill Name" content={employmentInfo.millName} />
                    <Desc title="Employed on" content={data.empDate.substring(0, 10)} />
                  </div>
                ) : (
                  ''
                )}
              </Col>
              <Col span={12} lg={12} md={12} sm={32} xs={32}>
                <Desc title="Age" content={data.age} />
                <Desc title="Gender" content={data.gender} />
                <Desc title="Experience" content={data.expLevel} />
                <Desc title="Skills" content={skillData.map((skill) => `${skill}, `)} />
                {data.empStatus === 'Employed' ? (
                  <div>
                    <Desc title="Mill Owner Name" content={employmentInfo.millOwnerName} />
                    <Desc title="Mill Owner Phone No." content={employmentInfo.millOwnerPhone} />
                  </div>
                ) : (
                  ''
                )}
              </Col>

              <Col span={32} className="p-3 mt-3">
                <h2>
                  <b>Image : </b>
                </h2>
                <Image src={data.imageURL} height="200px" width="200px" />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Drawer>
      <Modal
        title="Edit Labour"
        visible={editModalVisiblity}
        onCancel={onEditModalClose}
        onOk={editModalSave}
        okText="Update Labour Info"
      >
        <Form.Item label="Name">
          <Input
            title="Name "
            value={editData.name}
            onChange={(e) => {
              setEditData({ ...editData, name: e.target.value });
            }}
            placeholder="Enter Name"
            required
          />
        </Form.Item>
        <Form.Item label="Gender">
          <Radio.Group
            onChange={(e) => {
              setEditData({ ...editData, gender: e.target.value });
            }}
            value={editData.gender}
          >
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Age">
          <Input
            title="Age "
            value={editData.age}
            onChange={(e) => {
              setEditData({ ...editData, age: e.target.value });
            }}
            placeholder="Enter Age"
            required
          />
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

export { MiddleManLabours };
