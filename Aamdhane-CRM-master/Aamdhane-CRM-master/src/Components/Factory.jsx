/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable dot-notation */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState, useContext } from 'react';
import {
  Row,
  Col,
  Button,
  Modal,
  Drawer,
  Image,
  Form,
  Input,
  Tabs,
  Select,
  Tooltip,
  Upload,
  message,
  Alert,
  Switch,
  Checkbox,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  // LoginOutlined,
  SearchOutlined,
  InboxOutlined,
  CloseOutlined,
  ExclamationOutlined,
  ReloadOutlined,
  LinkOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import QS from 'query-string';

import { DataTable } from './Table/Table';
import { request } from '../service/common';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';
import { Desc } from './Common/Description';
import { AuthContext } from '../context/Authcontext';
import { HCLayout } from './Layout/HCLayout';
import './Layout/style.css';

const { Option } = Select;

const { TabPane } = Tabs;

const { Dragger } = Upload;

const Factory = () => {
  const [factory, setFactory] = useState([]);

  const [industryTypes, setIndustryTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [drawer, setDrawer] = useState(false);

  const [siderProps, setSiderProps] = useState({});

  const [selectedProfileMillImage, setSelectedProfileMillImage] = useState(null);

  const [selectedMillImage, setSelectedMillImage] = useState(null);

  const [selectedProfileAccommodationImage, setSelectedProfileAccommodationImage] = useState(null);

  const [selectedAccommodationImage, setSelectedAccommodationImage] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);

  const [millImage, setMillImage] = useState('');

  const [millImages, setMillImages] = useState({});

  const [accommodationImage, setAccommodationImage] = useState('');

  const [accommodationImages, setAccommodationImages] = useState({});

  const [editMillData, setEditMillData] = useState({});

  const [editModalVisiblity, setEditModalVisiblity] = useState(false);

  const [totalFactories, setTotalFactories] = useState(0);

  const [totalIndustries, setTotalIndustries] = useState(0);

  const [bannedFactories, setBannedFactories] = useState(0);

  const [disableProfileMillImageButton, setDisableProfileMillImageButton] = useState(true);

  const [disableMillImagesButton, setDisableMillImagesButton] = useState(true);

  const [disableProfileAccommodationImageButton, setDisableProfileAccommodationImageButton] =
    useState(true);

  const [disableAccommodationImagesButton, setDisableAccommodationImagesButton] = useState(true);

  const [nextButtonDisable, setNextButtonDisabled] = useState(false);
  const [prevButtonDisable, setPrevButtonDisabled] = useState(false);

  const [disableAddJobsButton, setDisableAddJobsButton] = useState(true);

  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const [filters, setFilters] = useState({});

  const { userContext } = useContext(AuthContext);

  const [allFactoryData, setAllFactoryData] = useState([]);

  const [showTrash, setShowTrash] = useState(false);

  const [customNotificationModal, setCustomNotificationModal] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedTempIds, setSelectedTempIds] = useState([]);

  const [files, setFiles] = useState([]);

  const refreshTable = (queryString) => {
    setLoading(true);

    request(`/api/mill/all?${queryString}`, 'GET')
      .then(async (data) => {
        if (data.length > 0) {
          setNextButtonDisabled(false);
          // eslint-disable-next-line array-callback-return
          data.map((item) => {
            item.key = item.id;
          });

          setFactory(data);

          setLoading(false);
        } else {
          setNextButtonDisabled(true);
        }
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => setLoading(false));
  };

  const finalDelete = (record) => {
    Modal.confirm({
      title: 'This action is not reversable',
      icon: <ExclamationOutlined />,
      content: 'Please be careful while deleteting permanently. this action is undoable',
      onOk: () => {
        setLoading(true);
        console.log(record);
        request(`/api/mill/delete?millId=${record.id}`, 'DELETE')
          .then((data) => {
            setFactory(factory.filter((mill) => mill.id !== record.id));
            setLoading(false);
          })
          .catch((err) => console.log(err));
      },
      okText: 'Delete',
    });
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

  const getAllFactoryData = () => {
    request('/api/getAll/mills', 'GET')
      .then((data) => setAllFactoryData(data))
      .catch((error) => console.log(error));
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

  const requestsCaller = () => {
    setLoading(true);

    request(`/api/mill/all`, 'GET')
      .then(async (data) => {
        // eslint-disable-next-line array-callback-return
        data.map((item) => {
          item.key = item.id;
        });
        setFactory(data);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });

    request('/api/admin-tasks/dropdown/industryType')
      .then(async (data) => {
        setTotalIndustries(data.length);
        setIndustryTypes(data);
      })
      .catch((err) => {
        message.error('Failed to load data');
        throw err;
      });
  };

  useEffect(() => {
    getAllFactoryData();

    requestsCaller();
    request(`/api/count/mills`, 'GET')
      .then(async (data) => {
        setTotalFactories(data.totalMills);
        setBannedFactories(data.bannedMills);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  const notificationModal = () => {
    setCustomNotificationModal(true);
    setSelectedIds([...selectedIds, ...selectedTempIds]);
    setSelectedTempIds([]);
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
          <Button type="primary" className="w-44" style={{ border: 'none' }}>
            <CSVLink
              filename="Factories.csv"
              data={allFactoryData.map((factory) => {
                const updatedFactory = { ...factory };
                updatedFactory.phone = `=""`.concat(
                  updatedFactory.millOwner?.userInfo?.phone,
                  `""`,
                );
                updatedFactory.millOwnerName = updatedFactory.millOwner?.userInfo?.name;
                delete updatedFactory.id;
                delete updatedFactory.millOwnerId;
                delete updatedFactory.millOwner;
                updatedFactory.isBanned = !updatedFactory.isBanned ? 'false' : 'true';
                return updatedFactory;
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
    setEditMillData(record);
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to Ban this mill',
      okText: 'Yes, Ban',
      onOk: () => {
        setLoading(true);
        request(`/api/mill?millId=${record.id}`, 'DELETE')
          .then(async () => {
            setFactory(
              factory.map((item) => (item.id === record.id ? { ...item, isBanned: true } : item)),
            );

            setBannedFactories(bannedFactories + 1);

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
      title: 'Are you sure, you want to un-ban this mill',
      okText: 'Yes, Un-ban',
      onOk: () => {
        setLoading(true);
        request(`/api/mill/restore?millId=${record.id}`, 'PATCH')
          .then(async () => {
            setFactory(
              factory.map((item) => (item.id === record.id ? { ...item, isBanned: false } : item)),
            );

            setBannedFactories(bannedFactories - 1);

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
    setMillImage('');
    setMillImages({});
    setAccommodationImage('');
    setAccommodationImages({});
    setSelectedJob(null);
  };

  const onDrawerOpen = (record) => {
    setSiderProps({
      title: record.millName,
      data: record,
    });

    setSelectedJob(null);
    setDrawer(true);
    if (record.millImage !== undefined) setMillImage(record.millImage);
    if (record.millImages !== undefined) setMillImages(record.millImages);
    if (record.accommodation !== undefined) setAccommodationImage(record.accommodation);
    if (record.accommodationImages !== undefined)
      setAccommodationImages(record.accommodationImages);
  };

  const data = siderProps.data || {};

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

  const onEditModalClose = () => {
    setEditModalVisiblity(false);
    setEditMillData({});
  };

  const editModalSave = () => {
    setLoading(true);
    setEditModalVisiblity(false);
    request(`/api/mill?millId=${editMillData.id}`, 'PATCH', {
      data: {
        millName: editMillData.millName,
        address: editMillData.address,
        area: editMillData.area,
        pinCode: editMillData.pinCode,
        industryType: editMillData.industryType,
      },
    })
      .then(async () => {
        setFactory(
          factory.map((factory) => (factory.id === editMillData.id ? editMillData : factory)),
        );
        setEditMillData({});
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const onImageChange = (imageType, e) => {
    if (imageType === 'Profile Mill Image') setSelectedProfileMillImage(e.target.files[0]);
    else if (imageType === 'Mill Image') setSelectedMillImage(e.target.files[0]);
    else if (imageType === 'Profile Accommodation Image')
      setSelectedProfileAccommodationImage(e.target.files[0]);
    else setSelectedAccommodationImage(e.target.files[0]);
  };

  const onImageUpload = (imageType) => {
    const imageObj = {};
    if (imageType === 'replaceMillDp') {
      imageObj.image = selectedProfileMillImage;
      setDisableProfileMillImageButton(false);
    } else if (imageType === 'millPhoto') {
      imageObj.image = selectedMillImage;
      setDisableMillImagesButton(false);
    } else if (imageType === 'replaceAccommodationDp') {
      imageObj.image = selectedProfileAccommodationImage;
      setDisableProfileAccommodationImageButton(false);
    } else {
      imageObj.image = selectedAccommodationImage;
      setDisableAccommodationImagesButton(false);
    }

    setLoading(true);
    request(`/api/mill/${imageType}?millId=${siderProps.data.id}`, 'POST', {
      formData: files[files.length - 1],
    })
      .then(async (data) => {
        if (imageType === 'replaceMillDp') {
          setSelectedProfileMillImage(null);
          setDisableProfileMillImageButton(true);
          setMillImage(data.millImage);
        } else if (imageType === 'millPhoto') {
          setSelectedMillImage(null);
          setDisableMillImagesButton(true);
          setMillImages(data.millImages);
        } else if (imageType === 'replaceAccommodationDp') {
          setSelectedProfileAccommodationImage(null);
          setDisableProfileAccommodationImageButton(true);
          setAccommodationImage(data.accommodation);
        } else {
          setSelectedAccommodationImage(null);
          setDisableAccommodationImagesButton(true);
          setAccommodationImages(data.accommodationImages);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (imageType === 'replaceMillDp') {
          setSelectedProfileMillImage(null);
          setDisableProfileMillImageButton(true);
        } else if (imageType === 'millPhoto') {
          setSelectedMillImage(null);
          setDisableMillImagesButton(true);
        } else if (imageType === 'replaceAccommodationDp') {
          setSelectedProfileAccommodationImage(null);
          setDisableProfileAccommodationImageButton(true);
        } else {
          setSelectedAccommodationImage(null);
          setDisableAccommodationImagesButton(true);
        }
        console.log(err);
      });
  };

  const onJobUpload = () => {
    const fileObj = { file: selectedJob };
    setDisableAddJobsButton(false);
    setLoading(true);
    request(`/api/job/bulk/${siderProps.data.id}`, 'POST', {
      formData: fileObj,
    })
      .then(async () => {
        setDisableAddJobsButton(true);
        message.success('Jobs excel uploaded successfully');
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setDisableAddJobsButton(true);
        console.log(err);
      });
  };

  const onDeleteImage = (imageType, img) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete the image?',
      okText: 'Yes, Delete',
      onOk: () => {
        setLoading(true);
        request(`/api/mill/${imageType}?millId=${siderProps.data.id}`, 'PATCH', {
          data: {
            url: img,
          },
        })
          .then(async () => {
            if (imageType === 'millPhoto')
              setMillImages(millImages.filter((image) => image !== img));
            else setAccommodationImages(accommodationImages.filter((image) => image !== img));
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };

  const handleImages = (e) => {
    setFiles([...files, e.file.originFileObj]);
  };

  const columns = [
    {
      key: 'millName',
      title: 'Mill Name',
      dataIndex: 'millName',
      ellipsis: {
        showTitle: false,
      },
      render: (millName) => (
        <Tooltip placement="topLeft" title={millName}>
          {millName}
        </Tooltip>
      ),

      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.millName}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  millName: e.target.value,
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
              onClick={() => clearFilter('millName')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      // onFilter: (value, record) => record.millName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (record) => <span> {record.millOwner.userInfo.phone} </span>,
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
      // onFilter: (value, record) => record.millOwner.userInfo.phone.includes(value),
    },
    {
      key: 'city',
      title: 'city',
      dataIndex: 'city',
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.city}
              autoFocus
              onChange={(e) => {
                onTableFilterChange({
                  city: e.target.value,
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
              onClick={() => clearFilter('city')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) => record.city.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 'industryType',
      title: 'Mill Type',
      dataIndex: 'industryType',
      // filters: industryTypes.map((item) => ({
      //   text: item.label,
      //   value: item.label,
      // })),
      // onFilter: (value, record) => record.industryType === value,
    },

    {
      key: 'Jobs',
      title: 'Jobs',
      render: (record) => (
        <Link to={`/job?millId=${record.id}`}>
          <LinkOutlined style={innerTableActionBtnDesign} /> {record?.jobs?.length}
        </Link>
      ),
      // sorter: {
      //   compare: (param1, param2) => param1.jobs?.length - param2.jobs?.length,
      // },
    },
    {
      key: 'Applications',
      title: 'Applications',
      render: (record) => (
        <center>
          {record.jobs?.reduce((count, job) => count + (job.applications || []).length, 0)}
        </center>
      ),
      // sorter: {
      //   compare: (param1, param2) =>
      //     param1.jobs?.reduce((count, job) => count + (job.applications || []).length, 0) -
      //     param2.jobs?.reduce((count, job) => count + (job.applications || []).length, 0),
      // },
    },
    {
      key: 'In Review',
      title: 'In Review',
      render: (record) => (
        <center>
          {record.jobs?.reduce(
            (count, job) =>
              count +
              job.applications?.reduce(
                (appCount, app) => (appCount + (app.status === 2) ? 1 : 0),
                0,
              ),
            0,
          )}
        </center>
      ),
      // sorter: {
      //   compare: (param1, param2) =>
      //     param1.jobs?.reduce(
      //       (count, job) =>
      //         count +
      //         job.applications?.reduce(
      //           (appCount, app) => (appCount + (app.status === 2) ? 1 : 0),
      //           0,
      //         ),
      //       0,
      //     ) -
      //     param2.jobs?.reduce(
      //       (count, job) =>
      //         count +
      //         job.applications?.reduce(
      //           (appCount, app) => (appCount + (app.status === 2) ? 1 : 0),
      //           0,
      //         ),
      //       0,
      //     ),
      // },
    },
    {
      key: 'Pending',
      title: 'Pending',
      render: (record) => (
        <center>
          {record.jobs?.reduce(
            (count, job) =>
              count +
              job.applications?.reduce(
                (appCount, app) => (appCount + (app.status === 1) ? 1 : 0),
                0,
              ),
            0,
          )}
        </center>
      ),
      // sorter: {
      //   compare: (param1, param2) =>
      //     param1.jobs?.reduce(
      //       (count, job) =>
      //         count +
      //         job.applications?.reduce(
      //           (appCount, app) => (appCount + (app.status === 1) ? 1 : 0),
      //           0,
      //         ),
      //       0,
      //     ) -
      //     param2.jobs?.reduce(
      //       (count, job) =>
      //         count +
      //         job.applications?.reduce(
      //           (appCount, app) => (appCount + (app.status === 1) ? 1 : 0),
      //           0,
      //         ),
      //       0,
      //     ),
      // },
    },
    {
      key: 'createAt',
      title: 'Reg. Date',
      render: (record) => (
        <Tooltip
          placement="top"
          title={`${new Date(record.createdAt).toLocaleDateString()} ${new Date(
            record.createdAt,
          ).toLocaleTimeString()}`}
        >
          {`${new Date(record.createdAt).toLocaleDateString()}`}
        </Tooltip>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      width: 200,
      render: (record) => (
        <>
          <EyeOutlined
            style={innerTableActionBtnDesign}
            onClick={() => {
              onDrawerOpen(record);
            }}
          />
          {userContext.access['factoryOwners'][2] ? (
            <EditOutlined style={innerTableActionBtnDesign} onClick={() => onEdit(record)} />
          ) : null}
          {record.isBanned ? (
            <ReloadOutlined style={innerTableActionBtnDesign} onClick={() => onUnban(record)} />
          ) : userContext.access['factoryOwners'][3] ? (
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

  const rowSelection = {
    columnTitle: <div />,

    onChange: (keys, selectedRows) => {
      const temp = [];
      selectedRows.map((row) => temp.push(row.millOwner.userId));
      setSelectedTempIds(temp);
    },
  };

  // eslint-disable-next-line react/jsx-filename-extension
  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Factories"
      actions={actionBtn}
    >
      <Row gutter={24} className="p-3">
        <Col span={8} xs={24} md={8} sm={12} lg={8} className="gutter-row ">
          <div className="tileStyle">
            <h2>Total Factories</h2>
            <span>{totalFactories}</span>
          </div>
        </Col>
        <Col span={8} xs={24} md={8} sm={12} lg={8} className="gutter-row">
          <div className="tileStyle">
            <h2>Total Industry Types</h2>
            <span>{totalIndustries}</span>
          </div>
        </Col>
        <Col xs={24} md={8} sm={12} lg={8}>
          <div className="tileStyle">
            <h2>Banned Factories</h2>
            <span>{bannedFactories}</span>
          </div>
        </Col>
      </Row>
      {showTrash ? (
        <Alert
          type="warning"
          message="Factories in trash will be removed automatically after 30 days"
          showIcon
        />
      ) : null}
      <DataTable
        usersData={factory}
        loading={loading}
        pagination={false}
        rowSelection={rowSelection}
        differRows
        columns={columns}
      />
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button
            disabled={prevButtonDisable}
            type="primary"
            onClick={() => paginationHandler('b', factory[0].id)}
            title="Prev"
          >
            Prev
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            disabled={nextButtonDisable}
            onClick={() => paginationHandler('f', factory[factory.length - 1].id)}
            title="Next"
          >
            Next
          </Button>
        </Col>
      </Row>
      <Drawer
        title={`${siderProps?.title}'s information`}
        width="750px"
        placement="right"
        onClose={onDrawerClose}
        visible={drawer}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Factory Information" key="1">
            <Row>
              <Col span={12} lg={12} md={12} sm={32} xs={32}>
                <Desc title="Mill Name" content={data.millName} />
                <Desc title="Address" content={data.address} />
                <Desc title="State" content={data.state} />
                <Desc title="Area" content={data.area} />
                <Desc title="City" content={data.city} />
                <Desc title="Industry Type" content={data.industryType} />
              </Col>
              <Col span={12} lg={12} md={12} sm={32} xs={32}>
                <Desc title="Owner Name" content={data.millOwner?.userInfo?.name} />
                <Desc title="Phone number" content={data.millOwner?.userInfo?.phone} />
                <Desc title="Pin Code" content={data.pinCode} />

                <Desc title="Latitude" content={data.latitude} />
                <Desc title="Longitude" content={data.longitude} />
              </Col>
            </Row>

            <Row>
              <Col span={8} lg={8} md={12} sm={24} xs={24} className="p-3 mt-3">
                <h2>
                  <b>Profile Image : </b>
                </h2>
                <Image src={millImage} preview={false} alt="Not Available" />
                <br />
                <Input
                  type="file"
                  style={{ border: 'none', width: '300px' }}
                  onChange={(e) => onImageChange('Profile Mill Image', e)}
                  required
                />
                <Button
                  type="primary"
                  onClick={() => onImageUpload('replaceMillDp')}
                  disabled={!disableProfileMillImageButton}
                >
                  Update Profile Image
                </Button>
              </Col>
            </Row>

            <Row>
              <Col span={24} lg={24} sm={24} md={24} xl={24}>
                <h2>
                  <br />
                  <b>Mill Images : </b>
                </h2>
                {Object.keys(millImages).length < 5 ? (
                  <div>
                    <Dragger multiple onChange={handleImages}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading
                        company data or other band files
                      </p>
                    </Dragger>
                    ,
                    {/* <Input
                      type="file"
                      style={{ border: 'none', width: '300px' }}
                      onChange={(e) => onImageChange('Mill Image', e)}
                      required
                    /> */}
                    <Button
                      type="primary"
                      onClick={() => onImageUpload('millPhoto')}
                      disabled={!disableMillImagesButton}
                    >
                      Upload
                    </Button>
                  </div>
                ) : null}
              </Col>

              {Object.keys(millImages).map((img) => (
                <Col span={8} lg={8} md={12} sm={24} xs={24} className="p-3 mt-3">
                  <Image src={millImages[img]} preview={false} height={150} alt="Not Available" />
                  <br />
                  <DeleteOutlined
                    style={innerTableActionBtnDesign}
                    onClick={() => onDeleteImage('millPhoto', millImages[img])}
                  />
                </Col>
              ))}
            </Row>

            <Row>
              <Col span={8} lg={8} md={12} sm={24} xs={24} className="p-3 mt-3">
                <h2>
                  <b>Profile Accommodation Image : </b>
                </h2>
                <Image src={accommodationImage} preview={false} alt="Not Available" />
                <br />
                <Input
                  type="file"
                  style={{ border: 'none', width: '300px' }}
                  onChange={(e) => onImageChange('Profile Accommodation Image', e)}
                  required
                />
                <Button
                  type="primary"
                  onClick={() => onImageUpload('replaceAccommodationDp')}
                  disabled={!disableProfileAccommodationImageButton}
                >
                  Update Profile Accommodation Image
                </Button>
              </Col>
            </Row>

            <>
              <Row>
                <Col span={24} lg={24} sm={24} md={24} xl={24}>
                  <h2>
                    <br />
                    <b>Accommodation Images: </b>
                  </h2>
                  {Object.keys(accommodationImages).length < 5 ? (
                    <div>
                      <Input
                        type="file"
                        style={{ border: 'none', width: '300px' }}
                        onChange={(e) => onImageChange('Accommodation Image', e)}
                        required
                      />
                      <Button
                        type="primary"
                        onClick={() => onImageUpload('accommodationPhoto')}
                        disabled={!disableAccommodationImagesButton}
                      >
                        Upload
                      </Button>
                    </div>
                  ) : null}
                </Col>
              </Row>
              <Row>
                {Object.keys(accommodationImages).map((img) => (
                  <Col span={8} lg={8} md={12} sm={24} xs={24} className="p-3 mt-3">
                    <Image
                      src={accommodationImages[img]}
                      preview={false}
                      height={150}
                      alt="Not Available"
                    />
                    <br />
                    <DeleteOutlined
                      style={innerTableActionBtnDesign}
                      onClick={() => onDeleteImage('accommodationPhoto', accommodationImages[img])}
                    />
                  </Col>
                ))}
              </Row>
            </>
          </TabPane>

          <TabPane tab="Add Jobs" key="2">
            <Row>
              <h2>
                <b>Add Jobs</b>
              </h2>
              <Input
                type="file"
                style={{ border: 'none', width: '300px' }}
                onChange={(e) => setSelectedJob(e.target.files[0])}
                required
              />
              <Button type="primary" onClick={() => onJobUpload()} disabled={!disableAddJobsButton}>
                Add Jobs
              </Button>
            </Row>
          </TabPane>
        </Tabs>
      </Drawer>
      <Modal
        title="Edit Mill"
        visible={editModalVisiblity}
        onCancel={onEditModalClose}
        onOk={editModalSave}
        okText="Update Mill Info"
      >
        <Form.Item label="Mill Name">
          <Input
            title="Mill Name "
            value={editMillData.millName}
            placeholder="Enter Mill Name"
            required
            onChange={(e) => {
              setEditMillData((editMillData) => ({
                ...editMillData,
                millName: e.target.value,
              }));
            }}
          />
        </Form.Item>

        <Form.Item label="Address">
          <Input
            title="Address "
            value={editMillData.address}
            placeholder="Enter Address"
            required
            onChange={(e) => {
              setEditMillData({ ...editMillData, address: e.target.value });
            }}
          />
        </Form.Item>

        <Form.Item label="Area">
          <Input
            title="Area "
            value={editMillData.area}
            onChange={(e) => {
              setEditMillData({ ...editMillData, area: e.target.value });
            }}
            placeholder="Enter Area"
            required
          />
        </Form.Item>

        <Form.Item label="Pin Code">
          <Input
            title="Pin Code "
            value={editMillData.pinCode}
            placeholder="Enter Pin Code"
            required
            onChange={(e) => {
              setEditMillData({ ...editMillData, pinCode: e.target.value });
            }}
          />
        </Form.Item>

        <Form.Item label="Industry Type">
          <Select
            value={editMillData.industryType}
            onChange={(value) => {
              setEditMillData({ ...editMillData, industryType: value });
            }}
          >
            {industryTypes.map((type) => (
              <Option value={type.label} key={type.id}>
                {type.label}
              </Option>
            ))}
          </Select>
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

export { Factory };
