/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Collapse, List, Row, Col, Skeleton, Button, message, Input } from 'antd';
import { MinusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { HCLayout } from './Layout/HCLayout';

import { request } from '../service/common';
import './Layout/style.css';

const { Panel } = Collapse;

const listStyle = {
  padding: 5,
  paddingLeft: 40,
};

const MappedUsers = () => {
  const [mappedUsers, setMappedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [exportData, setExportData] = useState([]);
  const [prevBtnDisable, setPrevBtnDisabled] = useState(false);
  const [nextBtnDisable, setNextBtnDisabled] = useState(false);
  const [firebaseID, setFirebaseID] = useState('');

  const getExportData = () => {
    request('/api/getAll/mapped-users', 'GET')
      .then((data) => setExportData(data))
      .catch((error) => console.log(error));
  };

  const fetchData = () => {
    setLoading(true);
    request(`/api/app-user/mapped-users?page=${page}`)
      .then(async (data) => {
        if (data.length > 0) {
          setNextBtnDisabled(false);
          setMappedUsers(data);
          setLoading(false);
          console.log(data);
        } else {
          setNextBtnDisabled(true);
        }
      })
      .catch((err) => {
        message.error('Failed to load data');
        console.log(err);
      });
  };
  useEffect(() => {
    fetchData();
    getExportData();
  }, []);

  useEffect(() => {
    fetchData();
    if (page === 1) {
      setPrevBtnDisabled(true);
    } else {
      setPrevBtnDisabled(false);
    }
  }, [page]);
  const actionBtn = [
    <Row gutter={16}>
      <Col>
        <Button type="primary" onClick={fetchData}>
          <ReloadOutlined />
        </Button>
      </Col>
      <Col>
        <Button type="primary" className="w-44" style={{ border: 'none' }}>
          <CSVLink
            filename="MappedUserData.csv"
            data={exportData.map((data) => {
              const updatedData = { ...data };

              updatedData.id = data.authentication.firebaseUserId;
              updatedData.role =
                updatedData.role === 1
                  ? 'Labour'
                  : updatedData.role === 2
                  ? 'Agent'
                  : updatedData.role === 3
                  ? 'Mill Owner'
                  : 'N/A';
              updatedData.gender =
                updatedData.gender === 1 ? 'Male' : updatedData.gender === 2 ? 'Female' : 'N/A';
              updatedData.locale =
                updatedData.locale === 1
                  ? 'En'
                  : updatedData.locale === 2
                  ? 'Hi'
                  : updatedData.locale === 3
                  ? 'Ta'
                  : 'N/A';
              delete updatedData.authentication;
              delete updatedData.labour;
              delete updatedData.middleman;
              delete updatedData.millOwner;
              delete updatedData.bankDetails;
              delete updatedData.imageUrl;
              updatedData.isBanned = !updatedData.isBanned ? 'false' : 'true';
              return updatedData;
            })}
            onClick={() => {
              message.success('The file is downloading');
            }}
            className="w-44"
          >
            Export to CSV
          </CSVLink>
        </Button>
      </Col>
    </Row>,
  ];
  const pageNext = () => {
    setPage(page + 1);
  };
  const pagePrev = () => {
    page > 1 ? setPage(page - 1) : setPage(page);
  };

  const filterId = () => {
    firebaseID
      ? setMappedUsers(
          exportData.filter((user) => user.authentication.firebaseUserId === firebaseID),
        )
      : null;
  };

  return (
    <HCLayout
      title="Mapped Users Data"
      onBack={() => {
        window.location.href = '/';
      }}
      actions={actionBtn}
    >
      <Row>
        <Col>
          <Input
            onChange={(e) => setFirebaseID(e.target.value)}
            placeholder="Enter User Firebase ID"
          />
        </Col>
        <Col>
          <Button onClick={filterId}>Search</Button>
        </Col>
      </Row>
      {loading ? (
        <>
          <Skeleton.Button block active size="default" className="p-3" />
          <Skeleton.Button block shape="round" active size="default" className="p-3" />
          <Skeleton.Button block shape="round" active size="default" className="p-3" />
          <Skeleton.Button block shape="round" active size="default" className="p-3" />
          <Skeleton.Button block shape="round" active size="default" className="p-3" />
          <Skeleton.Button block shape="round" active size="default" className="p-3" />
        </>
      ) : (
        <Collapse accordion>
          {mappedUsers.map((user) => (
            <Panel
              style={{ width: '100%' }}
              header={<span style={{ width: '100%' }}>{user.authentication.firebaseUserId}</span>}
              key={user.id}
            >
              <ul key={user.id}>
                <li style={listStyle}> id : {user.id} </li>
                <li style={listStyle}> name : {user.name} </li>
                <li style={listStyle}> Phone : {user.phone} </li>
                <li style={listStyle}> Age : {user.age} </li>
                <li style={listStyle}>
                  Role :
                  {user.role === 1
                    ? 'Labour'
                    : user.role === 2
                    ? 'Agent'
                    : user.role === 3
                    ? 'Mill Owner'
                    : 'N/A'}{' '}
                </li>
                <li style={listStyle}>
                  Gender : {user.gender === 1 ? 'Male' : user.gender === 2 ? 'Female' : 'N/A'}{' '}
                </li>
                <li style={listStyle}>
                  Locale :
                  {user.locale === 1
                    ? 'En'
                    : user.locale === 2
                    ? 'Hi'
                    : user.locale === 3
                    ? 'Ta'
                    : 'N/A'}
                </li>
                <li style={listStyle}>State : {user.state}</li>
                <li style={listStyle}> ImageUrl : {user.imageUrl} </li>
                <li style={listStyle}> Active On App : {user.activeOnApp.toString()} </li>
                {/* <li>Bank Details: { user.bankDetails}</li> */}
                <li style={listStyle}>Banned : {user.isBanned.toString()}</li>
                <li style={listStyle}>Banned on : {user.bannedOn}</li>
                <li style={listStyle}>Registration Completed : {user.registrationCompleted}</li>
                <li style={listStyle}>Created On : {user.createdAt}</li>
                <li style={listStyle}>Update On : {user.updatedAt}</li>
                <li style={listStyle}>Last Active : {user.lastActive}</li>
              </ul>
            </Panel>
          ))}
        </Collapse>
      )}
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button type="primary" onClick={pagePrev} title="Prev" disabled={prevBtnDisable}>
            Prev
          </Button>
        </Col>
        <Col>
          <Button disabled={nextBtnDisable} type="primary" onClick={pageNext} title="Next">
            Next
          </Button>
        </Col>
      </Row>
    </HCLayout>
  );
};

export { MappedUsers };
