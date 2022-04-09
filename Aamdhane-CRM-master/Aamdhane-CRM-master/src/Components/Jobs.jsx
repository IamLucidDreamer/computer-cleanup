/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useContext } from 'react';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  // LoginOutlined,
  ReloadOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import { CSVLink } from 'react-csv';
import QS from 'query-string';
import { useLocation } from 'react-router-dom';
import {
  Drawer,
  Row,
  Col,
  Switch,
  Button,
  Modal,
  Form,
  Input,
  message,
  Radio,
  Tooltip,
  // Tabs,
  // Alert,
} from 'antd';
import { request } from '../service/common';
import { DataTable } from './Table/Table';
import { HCLayout } from './Layout/HCLayout';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';
import { Desc } from './Common/Description';
import { AuthContext } from '../context/Authcontext';

// const { TabPane } = Tabs;

const Jobs = () => {
  const { search } = useLocation();

  const paramMillId = search.split('=')[1];

  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);

  const [drawer, setDrawer] = useState(false);

  const [siderProps, setSiderProps] = useState({});

  const [editData, setEditData] = useState({});

  const [editModalVisiblity, setEditModalVisiblity] = useState(false);

  const [csvJobs, setCsvJobs] = useState([]);

  const [totalJobs, setTotalJobs] = useState(0);

  const [totalOpenings, setTotalOpenings] = useState(0);

  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const [filters, setFilters] = useState({});

  const [showTrash, setShowTrash] = useState(false);

  const [page, setPage] = useState(1);

  const [nextBtnDisable, setNextBtnDisabled] = useState(false);

  const [prevBtnDisable, setPrevBtnDisabled] = useState(false);

  const { userContext } = useContext(AuthContext);

  const refreshTable = (queryString) => {
    setLoading(true);
    request(
      paramMillId
        ? queryString
          ? `/api/job?millId=${paramMillId}&page=${page}&${queryString}`
          : `/api/job?millId=${paramMillId}&page=${page}`
        : queryString
        ? `/api/job?page=${page}&${queryString}`
        : `/api/job?page=${page}`,
      'GET',
    )
      .then(async (data) => {
        if (data.length > 0) {
          setNextBtnDisabled(false);
          data.map((item) => {
            item.key = item.id;
          });

          if (paramMillId) {
            setJobs(data.filter((job) => job.millId === parseInt(paramMillId, 10)));
          } else {
            setJobs(data);
          }
        } else {
          setNextBtnDisabled(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const getAllJobsData = () => {
    request('/api/getAll/jobs', 'GET')
      .then((data) => setCsvJobs(data))
      .catch((error) => console.log(error));
  };

  const getTrash = (val) => {
    setShowTrash(val);
    setPage(1);
    onTableFilterChange({ isBanned: val, page: undefined });
    if (val) {
      setFilterChange();
    } else {
      clearFilter('isBanned');
    }
  };

  useEffect(() => {
    refreshTable(QS.stringify(filters));
    if (page === 1) {
      setPrevBtnDisabled(true);
    } else {
      setPrevBtnDisabled(false);
    }
  }, [page]);

  useEffect(() => {
    getAllJobsData();
    request(`/api/count/jobs`, 'GET').then((data) => {
      setTotalJobs(data.totalJobs);
      setTotalOpenings(data.jobOpenings);
    });

    // const interval = setInterval(requestsCaller, 300000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFilterChanged) {
      refreshTable(QS.stringify(filters));
      setIsFilterChanged(false);
    }
  }, [isFilterChanged]);

  const actionBtn = [
    <Row gutter={16}>
      <Col>
        <div style={{ paddingTop: 5 }}>
          Trash: &nbsp;
          <Switch defaultChecked={showTrash} onChange={getTrash} />
        </div>
      </Col>
      <Col>
        <Button
          type="primary"
          onClick={() => {
            setPage(1);
            refreshTable();
          }}
        >
          <ReloadOutlined />
        </Button>
      </Col>
      <Col>
        {userContext.access['download'][0] ? (
          <Button type="primary" className="w-44" style={{ border: 'none' }}>
            <CSVLink
              filename="Jobs.csv"
              data={csvJobs.map((job) => {
                const updatedJob = { ...job };
                updatedJob.expReq = ``.concat(updatedJob.expReq, ` years`);
                updatedJob.workingHours = ``.concat(updatedJob.workingHours, ` hours`);
                updatedJob.addedOn = `=""`.concat(updatedJob.addedOn?.substring(0, 10), `""`);
                updatedJob.jobArea = updatedJob.mill.area;
                updatedJob.jobCity = updatedJob.mill.city;
                updatedJob.jobState = updatedJob.mill.state;
                updatedJob.millName = updatedJob.mill.millName;
                updatedJob.genderPreference = updatedJob.genderPreference === 1 ? 'Male' : 'Female';
                updatedJob.typeOfLabour = updatedJob.typeOfLabour === 1 ? 'Skilled' : 'UnSkilled';
                updatedJob.workType = updatedJob.workType === 1 ? 'Full-time' : 'Part-time';
                updatedJob.isBanned = !updatedJob.isBanned ? 'false' : 'true';
                delete updatedJob.createdAt;
                delete updatedJob.updatedAt;
                delete updatedJob.mill;
                delete updatedJob.id;
                delete updatedJob.millId;
                return updatedJob;
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

  const pageNext = () => {
    setPage(page + 1);
  };
  const pagePrev = () => {
    page > 1 ? setPage(page - 1) : setPage(page);
  };

  const onEdit = (record) => {
    setEditModalVisiblity(true);
    setEditData(record);
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to ban this job',
      okText: 'Yes, Ban',
      onOk: () => {
        setLoading(true);
        request(`/api/job/${record.id}`, 'DELETE')
          .then(async () => {
            setJobs(jobs.map((job) => (job.id === record.id ? { ...job, isBanned: true } : job)));
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
      title: 'Are you sure, you want to un-ban this job',
      okText: 'Yes, Un-ban',
      onOk: () => {
        setLoading(true);
        request(`/api/job/${record.id}/restore`, 'PATCH')
          .then(async () => {
            setJobs(jobs.map((job) => (job.id === record.id ? { ...job, isBanned: false } : job)));

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
      title: `${record.jobTitle}'s information`,
      data: record,
    });

    setDrawer(true);
  };

  const onEditModalClose = () => {
    setEditModalVisiblity(false);
    setEditData({});
  };

  const editModalSave = () => {
    setEditModalVisiblity(false);
    setLoading(true);
    request(`/api/job/${editData.id}`, 'PATCH', {
      data: {
        jobTitle: editData.jobTitle,
        peopleReq: editData.peopleReq,
        typeOfLabour: editData.typeOfLabour.toString(),
        workType: editData.workType.toString(),
      },
    })
      .then(async () => {
        setJobs(jobs.map((job) => (job.id === editData.id ? editData : job)));
        setLoading(false);
        setEditData({});
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const onTableFilterChange = (query) => {
    setFilters({ ...filters, ...query });
  };

  const clearFilter = (type) => {
    setPage(1);
    setFilters({ ...filters, [type]: undefined, page: 1 });
    setIsFilterChanged(true);
  };

  const setFilterChange = () => {
    setIsFilterChanged(true);
    // setFilters({ ...filters, isChanged: true });
  };

  const cols = [
    {
      key: 8,
      title: 'Mill name',
      render: (record) => (record.mill?.millName === undefined ? '' : record.mill?.millName),
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.millName}
              autoFocus
              onChange={(e) => {
                setPage(1);
                onTableFilterChange({
                  millName: e.target.value,
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
    },
    {
      key: 1,
      title: 'Jobs',
      dataIndex: 'jobTitle',
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.jobTitle}
              autoFocus
              onChange={(e) => {
                setPage(1);
                onTableFilterChange({
                  jobTitle: e.target.value,
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
              onClick={() => clearFilter('jobTitle')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      // onFilter: (value, record) => record.jobTitle.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 2,
      title: 'Area',
      render: (record) => record.mill.area,
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.area}
              autoFocus
              onChange={(e) => {
                setPage(1);
                onTableFilterChange({ area: e.target.value });
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
              onClick={() => clearFilter('area')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      // onFilter: (value, record) => record.mill.area.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 3,
      title: 'City',
      render: (record) => record.mill.city,
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.city}
              autoFocus
              onChange={(e) => {
                setPage(1);
                onTableFilterChange({
                  city: e.target.value,
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
      // onFilter: (value, record) => record.mill.city.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 4,
      title: 'State',
      render: (record) => record.mill.state,
      filterDropdown: () => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={filters.state}
              autoFocus
              onChange={(e) => {
                setPage(1);
                onTableFilterChange({
                  state: e.target.value,
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
              onClick={() => clearFilter('state')}
              icon={<CloseOutlined />}
              type="default"
              style={{ borderRadius: 0, background: 'red', color: 'white' }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      // onFilter: (value, record) => record.mill.state.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 5,
      title: 'Openings',
      dataIndex: 'peopleReq',
      // sorter: {
      //   compare: (param1, param2) => param1.peopleReq - param2.peopleReq,
      // },
    },
    {
      key: 6,
      title: 'Salary Per Shift',
      dataIndex: 'salaryPerShift',
      // sorter: {
      //   compare: (param1, param2) => param1.salaryPerShift - param2.salaryPerShift,
      // },
    },
    // {
    //   key: 7,
    //   title: 'Labour Type',
    //   dataIndex: 'typeOfLabour',
    //   filters: [
    //     { text: 'Skilled', value: 'Skilled' },
    //     { text: 'UnSkilled', value: 'UnSkilled' },
    //   ],
    //   onFilter: (value, record) => record.typeOfLabour === value,
    // },
    // {
    //   key: 8,
    //   title: 'Job Type',
    //   dataIndex: 'workType',
    //   filters: [
    //     { text: 'Full Time', value: 'Full Time' },
    //     { text: 'Part Time', value: 'Part Time' },
    //   ],
    //   onFilter: (value, record) => record.workType === value,
    // },
    {
      key: 'createAt',
      title: 'Added On',
      render: (record) => (
        <Tooltip
          placement="top"
          title={`${new Date(record.addedOn).toLocaleDateString()} ${new Date(
            record.addedOn,
          ).toLocaleTimeString()}`}
        >
          {`${new Date(record.addedOn).toLocaleDateString()}`}
        </Tooltip>
      ),
    },
    {
      key: 9,
      title: 'Action',
      render: (record) => (
        <>
          <EyeOutlined
            style={innerTableActionBtnDesign}
            onClick={() => {
              onDrawerOpen(record);
            }}
          />
          {userContext.access['jobPosts'][2] ? (
            <EditOutlined style={innerTableActionBtnDesign} onClick={() => onEdit(record)} />
          ) : null}
          {record.isBanned === true ? (
            <ReloadOutlined style={innerTableActionBtnDesign} onClick={() => onUnban(record)} />
          ) : userContext.access['jobPosts'][3] ? (
            <DeleteOutlined style={innerTableActionBtnDesign} onClick={() => onDelete(record)} />
          ) : null}
        </>
      ),
    },
  ];

  const data = siderProps.data || {};

  return (
    <HCLayout
      title="Jobs"
      onBack={() => {
        window.location.href = '/';
      }}
      actions={actionBtn}
    >
      <Row gutter={24} className="p-3">
        <Col span={12} xs={24} md={12} sm={12} lg={12} className="gutter-row ">
          <div className="tileStyle">
            <h2>Total Jobs</h2>
            <span>{totalJobs}</span>
          </div>
        </Col>
        {/* <Col span={8} xs={24} md={8} sm={12} lg={8} className="gutter-row">
          <div className="tileStyle">
            <h2>Total Skilled Jobs</h2>
            <span>{totalSkilledJobs}</span>
          </div>
        </Col> */}
        <Col xs={24} md={12} sm={12} lg={12}>
          <div className="tileStyle">
            <h2>Total Opening</h2>
            <span>{totalOpenings}</span>
          </div>
        </Col>
      </Row>
      {/* <label>
        Factory
        <Select
          style={{ zIndex: 99 }}
          className="z-50"
          value={mill.label}
          onChange={(e) => filterJobs(e)}
          options={mills}
        />
      </label> */}
      <DataTable
        style={{ zIndex: -1 }}
        usersData={jobs}
        loading={loading}
        pagination={false}
        columns={cols}
        differRows
      />
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button
            type="primary"
            // onClick={() => {
            //   onTableFilterChange({
            //     direction: 'b',
            //     lastRecordId: jobs[0].id,
            //   });
            //   setIsFilterChanged(true);
            // }}
            onClick={pagePrev}
            title="Prev"
            disabled={prevBtnDisable}
          >
            Prev
          </Button>
        </Col>
        <Col>
          <Button disabled={nextBtnDisable} type="primary" onClick={pageNext} title="Next">
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
        <Row>
          <Col span={12} lg={12} md={12} sm={32} xs={32}>
            <Desc title="Job Title" content={data.jobTitle} />
            <Desc title="Job Area" content={data.mill?.area} />
            <Desc title="Job City" content={data.mill?.city} />
            <Desc title="Job State" content={data.mill?.state} />
          </Col>
          <Col span={12} lg={12} md={12} sm={32} xs={32}>
            <Desc title="Experience Required" content={`${data.expReq} years`} />
            <Desc title="Meal" content={data.mealType} />
            <Desc title="Medical Facilities" content={data.medicalValues} />
          </Col>
          <Col span={12} lg={12} md={12} sm={32} xs={32}>
            <Desc title="Skills Required" content={data.skillReq} />
            <Desc title="People Required" content={data.peopleReq} />
            <Desc title="Salary per Shift" content={data.salaryPerShift} />
          </Col>
          <Col span={12} lg={12} md={12} sm={32} xs={32}>
            <Desc title="Labour Type" content={data.typeOfLabour === 1 ? 'Skilled' : 'UnSkilled'} />
            <Desc title="Work Type" content={data.workType === 1 ? 'Full-time' : 'Part-time'} />
            <Desc title="Working hours" content={`${data.workingHours} hours`} />
          </Col>
        </Row>
      </Drawer>
      <Modal
        title="Edit Job"
        visible={editModalVisiblity}
        onCancel={onEditModalClose}
        onOk={editModalSave}
        okText="Update Job Info"
      >
        <Form.Item label="Job Title">
          <Input
            title="Job Title "
            value={editData.jobTitle}
            placeholder="Enter Job Title"
            required
            onChange={(e) => {
              setEditData((editData) => ({
                ...editData,
                jobTitle: e.target.value,
              }));
            }}
          />
        </Form.Item>

        <Form.Item label="Openings">
          <Input
            title="Openings "
            value={editData.peopleReq}
            placeholder="Enter No. of Openings"
            required
            onChange={(e) => {
              setEditData({ ...editData, peopleReq: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="Labour Type">
          <Radio.Group
            onChange={(e) => {
              setEditData({
                ...editData,
                typeOfLabour: e.target.value === 'Skilled' ? 1 : 2,
              });
            }}
            value={editData.typeOfLabour === 1 ? 'Skilled' : 'UnSkilled'}
          >
            <Radio value="Skilled">Skilled</Radio>
            <Radio value="UnSkilled">UnSkilled</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Work Type">
          <Radio.Group
            onChange={(e) => {
              setEditData({
                ...editData,
                workType: e.target.value === 'Full-time' ? 1 : 2,
              });
            }}
            value={editData.workType === 1 ? 'Full-time' : 'Part-time'}
          >
            <Radio value="Full-time">Full-time</Radio>
            <Radio value="Part-time">Part-time</Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </HCLayout>
  );
};

export { Jobs };
