/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { request } from '../service/common';
import { DataTable } from './Table/Table';
import { HCLayout } from './Layout/HCLayout';

const Applications = () => {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState();
  const { millId, jobId, millPhone } = useParams();
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [totalInReview, setTotalInReview] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [disableModifyStatusButton, setDisableModifyStatusButton] = useState(true);

  const requestsCaller = () => {
    setLoading(true);
    request(`/api/job/${jobId}/applications`, 'GET')
      .then(async (data) => {
        let countAccepted = 0;
        let countRejected = 0;
        let countInReview = 0;
        let countPending = 0;
        data.map((item) => (item.key = item.id));
        const temp = data.map((item) => {
          if (item.Status === 'Rejected' || item.Status === 'rejected') {
            countRejected += 1;
          } else if (item.Status === 'Accepted') {
            countAccepted += 1;
          } else if (item.Status === 'InReview') {
            countInReview += 1;
          } else {
            countPending += 1;
          }

          const newItem = item;
          newItem.AppliedOn = item.AppliedOn.substring(0, 10);
          return newItem;
        });
        setTotalApplications(data.length);
        setTotalAccepted(countAccepted);
        setTotalRejected(countRejected);
        setTotalInReview(countInReview);
        setTotalPending(countPending);
        setApplications(temp);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    requestsCaller();
    const interval = setInterval(requestsCaller, 300000);
    return () => clearInterval(interval);
  }, []);

  const modifyStatus = (record, status) => {
    setLoading(true);
    setDisableModifyStatusButton(false);
    let requestString = `/api/applications/job-action/${status}/${jobId}/${millId}/${record.userId}`;
    if (record.middleManUid !== undefined) requestString += `?middlemanId=${record.middleManUid}`;
    request(requestString, 'PUT')
      .then(async () => {
        setApplications(
          applications.map((application) =>
            application.id === record.id ? { ...application, Status: status } : application,
          ),
        );

        console.log(status);

        if (status === 'Rejected') {
          setTotalRejected(totalRejected + 1);
          if (totalAccepted > 0) {
            setTotalAccepted(totalAccepted - 1);
          }
        }

        if (status === 'Accepted') {
          setTotalAccepted(totalAccepted + 1);
          setTotalRejected(totalRejected - 1);
        }
        setDisableModifyStatusButton(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setDisableModifyStatusButton(true);
        setLoading(false);
      });
  };

  const cols = [
    {
      key: 1,
      title: 'Name',
      dataIndex: 'name',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={selectedKeys[0]}
              autoFocus
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={confirm}
              onBlur={confirm}
            />
          </Col>
          <Col>
            <Button
              onClick={confirm}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 2,
      title: 'Agent Name',
      render: (record) => (record.byMiddleMan === undefined ? 'N/A' : 'Agent'),
    },
    {
      key: 3,
      title: 'Age',
      dataIndex: 'age',
      sorter: {
        compare: (param1, param2) => param1.age - param2.age,
      },
    },
    {
      key: 4,
      title: 'Labourer Phone No.',
      dataIndex: 'phoneNo',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <Row className="p-3 shadow-lg">
          <Col>
            <Input
              placeholder="Search Here"
              value={selectedKeys[0]}
              autoFocus
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={confirm}
              onBlur={confirm}
            />
          </Col>
          <Col>
            <Button
              onClick={confirm}
              icon={<SearchOutlined />}
              type="primary"
              style={{ borderRadius: 0 }}
            />
          </Col>
        </Row>
      ),
      filterIcon: () => <SearchOutlined style={{ fontSize: 18 }} />,
      onFilter: (value, record) => record.phoneNo.includes(value),
    },
    {
      key: 5,
      title: 'Experience',
      dataIndex: 'exp',
      sorter: {
        compare: (param1, param2) => param1.exp - param2.exp,
      },
    },
    {
      key: 6,
      title: 'Applied On',
      dataIndex: 'AppliedOn',
    },
    {
      key: 7,
      title: 'Mill Phone No.',
      dataIndex: 'millPhone',
      render: () => millPhone,
    },
    {
      key: 8,
      title: 'Status',
      dataIndex: 'Status',
      render: (status) => (status === undefined ? 'Pending' : status),
      filters: [
        { text: 'Accepted', value: 'Accepted' },
        { text: 'Rejected', value: 'Rejected' },
        { text: 'In Review', value: 'InReview' },
        { text: 'Pending', value: 'Pending' },
      ],
      onFilter: (value, record) => record.Status === value,
    },

    {
      key: 9,
      title: 'Action',
      render: (record) => (
        <>
          {record.Status !== 'Accepted' && (
            <Button
              type="primary"
              onClick={() => modifyStatus(record, 'Accepted')}
              disabled={!disableModifyStatusButton}
            >
              Accept
            </Button>
          )}
          {'       '}
          {record.Status !== 'rejected' && record.Status !== 'Rejected' && (
            <Button
              type="primary"
              onClick={() => modifyStatus(record, 'Rejected')}
              disabled={!disableModifyStatusButton}
            >
              Reject
            </Button>
          )}{' '}
        </>
      ),
    },
  ];

  return (
    <HCLayout
      title="Applications"
      onBack={() => {
        window.location.href = `/jobs/${millId}/${millPhone}`;
      }}
    >
      <Row gutter={24} className="p-3">
        <Col xs={24} md={4} sm={12} lg={4} className="gutter-row ">
          <div className="tileStyle">
            <h2>Total Applications</h2>
            <span>{totalApplications}</span>
          </div>
        </Col>
        <Col xs={24} md={5} sm={12} lg={5} className="gutter-row">
          <div className="tileStyle">
            <h2>Total Accepted</h2>
            <span>{totalAccepted}</span>
          </div>
        </Col>

        <Col xs={24} md={5} sm={12} lg={5}>
          <div className="tileStyle">
            <h2>Total Rejected</h2>
            <span>{totalRejected}</span>
          </div>
        </Col>

        <Col xs={24} md={5} sm={12} lg={5} className="gutter-row">
          <div className="tileStyle">
            <h2>In Review</h2>
            <span>{totalInReview}</span>
          </div>
        </Col>

        <Col xs={24} md={5} sm={12} lg={5} className="gutter-row">
          <div className="tileStyle">
            <h2>Pending</h2>
            <span>{totalPending}</span>
          </div>
        </Col>
      </Row>
      <DataTable columns={cols} usersData={applications} loading={loading} />
    </HCLayout>
  );
};

export { Applications };
