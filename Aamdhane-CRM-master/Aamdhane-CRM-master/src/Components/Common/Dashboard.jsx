/* eslint-disable prefer-template */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import {
  BuildOutlined,
  PicCenterOutlined,
  SwitcherOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from 'chart.js';
// import { Bar, Line } from 'react-chartjs-2';
import { request } from '../../service/common';
import { HCLayout } from '../Layout/HCLayout';
import './dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

const blockStyle = {
  height: '150px',
  padding: 20,
};

const Dashboard = () => {
  // eslint-disable-next-line react/jsx-filename-extension
  // eslint-disable-next-line no-console

  const [mills, setMills] = useState(0);
  const [labourers, setLabourers] = useState(0);
  const [middlemen, setMiddlemen] = useState(0);
  const [applications, setApplications] = useState(0);
  const [middlemanLabours, setMiddlemanLabours] = useState(0);
  const [acceptedApplications, setAcceptedApplications] = useState(0);
  const [inReviewApplications, setInReviewApplications] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [inActiveUsers, setInActiveUsers] = useState(0);

  useEffect(() => {
    request(`/api/count/mills`, 'GET')
      .then(async (data) => {
        setMills(data.totalMills);
      })
      .catch((err) => {
        throw err;
      });

    request(`/api/count/uninstalled-users`, 'GET')
      .then(async (data) => {
        setInActiveUsers(data.uninstalledUsers);
      })
      .catch((err) => {
        throw err;
      });

    request(`/api/count/labourers`, 'GET')
      .then(async (data) => {
        setLabourers(data.totalLabourers);
      })
      .catch((err) => {
        throw err;
      });

    request(`/api/count/middlemen`, 'GET')
      .then(async (data) => {
        setMiddlemen(data.totalMiddlemen);
        setMiddlemanLabours(data.totalMiddlemanLabourers);
      })
      .catch((err) => {
        throw err;
      });

    request(`/api/count/applications`, 'GET')
      .then(async (data) => {
        setApplications(data.totalApplications);
        setAcceptedApplications(data.acceptedApplications);
        setInReviewApplications(data.inReviewApplications);
        setPendingApplications(data.pendingApplications);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  return (
    <HCLayout title="Dashboard">
      <Row gutter={[24, 24]}>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/factory')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Factories</h2>
            <BuildOutlined className="icon" /> <span className="num">{mills + ''}</span>
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/labourer')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Labourers</h2>
            <UserOutlined className="icon" /> <span className="num">{labourers + ''}</span>
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/agent')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Agents</h2>
            <PicCenterOutlined className="icon" /> <span className="num">{middlemen + ''}</span>
          </div>
        </Col>

        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/agent-labourer')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Labours Under Agents</h2>
            <BuildOutlined className="icon" /> <span className="num">{middlemanLabours + ''}</span>
          </div>
        </Col>

        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/approval')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Applications</h2>
            <SwitcherOutlined className="icon" /> <span className="num">{applications + ''}</span>
          </div>
        </Col>

        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/approval')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Accepted Applications</h2>
            <UserOutlined className="icon" />{' '}
            <span className="num">{acceptedApplications + ''}</span>
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/approval')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total In Review Applications</h2>
            <PicCenterOutlined className="icon" />{' '}
            <span className="num">{inReviewApplications + ''}</span>
          </div>
        </Col>
        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/approval')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Pending Applicatons</h2>
            <SwitcherOutlined className="icon" />{' '}
            <span className="num">{pendingApplications + ''}</span>
          </div>
        </Col>

        <Col
          className="gutter-row"
          xs={24}
          sm={12}
          lg={6}
          onClick={() => (window.location.href = '/inactives')}
        >
          <div style={blockStyle} className="bg-green-400 rounded-lg block">
            <h2>Total Inactive Users</h2>
            <SwitcherOutlined className="icon" /> <span className="num">{inActiveUsers + ''}</span>
          </div>
        </Col>
      </Row>
      {/* <Row>
        <Col span={12} xs={24} sm={24} lg={12} md={12} className="p-10">
          <Bar
            data={barDataJobs}
            width={700}
            height={300}
            options={{ maintainAspectRatio: false }}
          />
        </Col>

        <Col span={12} xs={24} sm={24} lg={12} md={12} className="p-10">
          <Line
            data={LineDataLabours}
            width={700}
            height={300}
            options={{
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                  },
                ],
                yAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                  },
                ],
              },
            }}
          />
        </Col>
      </Row> */}
    </HCLayout>
  );
};

export { Dashboard };
