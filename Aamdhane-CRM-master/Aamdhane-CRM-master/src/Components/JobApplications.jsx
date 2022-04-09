/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Input } from 'antd';
import { LinkOutlined, SearchOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { request } from '../service/common';
import { DataTable } from './Table/Table';
import { HCLayout } from './Layout/HCLayout';
import { innerTableActionBtnDesign } from './Layout/FormBtnStyle';

const JobApplications = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const { millId, millPhone } = useParams();

  console.log(loading);
  useEffect(() => {
    setLoading(true);
    request(`/api/job?millId=${millId}`, 'GET')
      .then(async (data) => {
        console.log(data);
        Promise.all(
          data.map(async (job) => {
            job.key = job.id;
            return request(`/api/job/${job.id}/applications`, 'GET')
              .then((jobApplications) => ({ ...job, jobApplications }))
              .catch((err) => {
                console.log(err);
              });
          }),
        ).then((jobs) => {
          setJobs(jobs.filter((job) => job.jobApplications.length !== 0));
          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const cols = [
    {
      key: 1,
      title: 'Jobs',
      dataIndex: 'jobTitle',
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
      onFilter: (value, record) => record.jobTitle.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 2,
      title: 'Area',
      dataIndex: 'jobArea',
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
      onFilter: (value, record) => record.jobArea.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 3,
      title: 'City',
      dataIndex: 'jobCity',
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
      onFilter: (value, record) => record.jobCity.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 4,
      title: 'State',
      dataIndex: 'jobState',
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
      onFilter: (value, record) => record.jobState.toLowerCase().includes(value.toLowerCase()),
    },
    {
      key: 5,
      title: 'Openings',
      dataIndex: 'peopleReq',
      sorter: {
        compare: (param1, param2) => param1.peopleReq - param2.peopleReq,
      },
    },
    {
      key: 6,
      title: 'Labour Type',
      dataIndex: 'typeOfLabour',
      filters: [
        { text: 'Skilled', value: 'Skilled' },
        { text: 'UnSkilled', value: 'UnSkilled' },
      ],
      onFilter: (value, record) => record.typeOfLabour === value,
    },
    {
      key: 7,
      title: 'Job Type',
      dataIndex: 'workType',
      filters: [
        { text: 'Full Time', value: 'Full Time' },
        { text: 'Part Time', value: 'Part Time' },
      ],
      onFilter: (value, record) => record.workType === value,
    },
    {
      key: 8,
      title: 'Applications',
      render: (record) => (
        <Link to={`/applications/${millId}/${record.id}/${millPhone}`}>
          <LinkOutlined style={innerTableActionBtnDesign} />
        </Link>
      ),
    },
  ];

  return (
    <HCLayout
      title="Jobs Applications"
      onBack={() => {
        window.location.href = '/approval';
      }}
    >
      <DataTable columns={cols} usersData={jobs} loading={loading} />
    </HCLayout>
  );
};

export { JobApplications };
