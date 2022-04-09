/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-continue */
import React, { useState, useEffect } from 'react';
import { Tooltip, Button, Modal, Input, Row, Col } from 'antd';
import { EditFilled, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { request } from '../service/common';
import { DataTable } from './Table/Table';
import './Layout/style.css';
import { HCLayout } from './Layout/HCLayout';

const SupportStatus = {
  Unresolved: 1,
  InProgress: 2,
  Resolved: 3,
};

export const Support = () => {
  const [loading, setLoading] = useState(false);
  const [support, setSupport] = useState([]);
  const [noteModalVisibality, setNoteModalVisibality] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [queryId, setQueryId] = useState();
  const [queryStatus, setQueryStatus] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (pageParam) => {
    setLoading(true);
    request(pageParam === undefined || pageParam === null
      ? '/api/support/all' : `/api/support/all${pageParam}`, 'GET')
      .then(async (data) => {
        setSupport(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const editPrompt = (record) => {
    setQueryId(record.id);
    setQueryStatus(parseInt(record.isResolved, 10));
    setCustomNote(record.note);
    setNoteModalVisibality(true);
  };

  const onQueryStatusChange = () => {
    // apiCall
    const updateQueryData = {
      isResolved: queryStatus,
      note: customNote,
    };

    request(`/api/support/${queryId}`, 'PATCH', { data: updateQueryData })
      .then(() => {
        setNoteModalVisibality(false);
        setSupport(
          support.map((supp) =>
            supp.id === queryId
              ? { ...supp, isResolved: updateQueryData.isResolved, note: updateQueryData.note }
              : supp,
          ),
        );
      })
      .catch((error) => console.log(error));
  };

  const customNotePrompt = (record, status) => {
    setNoteModalVisibality(true);
    setQueryStatus(parseInt(status, 10));
    setQueryId(record.id);
    setCustomNote(record.note);
  };

  const columns = [
    {
      title: 'Name',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.user?.name}>
          {record.user?.name}
        </Tooltip>
      ),
    },
    {
      title: 'Phone No.',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.user?.phone}>
          {record.user?.phone}
        </Tooltip>
      ),
    },
    {
      title: 'Query',
      dataIndex: 'query',
      ellipsis: {
        showTitle: false,
      },
      render: (query) => (
        <Tooltip placement="topLeft" title={query}>
          {query}
        </Tooltip>
      ),
    },
    {
      title: 'Raised On',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={moment(record.raisedOn).format('DD-MM-YYYY h:mm:ss A')}>
          {moment(record.raisedOn).format('DD-MM-YYYY')}
        </Tooltip>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: 150,
      render: (record) =>
        record.isResolved === 1
          ? 'Unresolved'
          : record.isResolved === 2
          ? 'In Progress'
          : record.isResolved === 3
          ? 'Resolved'
          : record.isResolved,
    },
    {
      key: 'note',
      title: 'Note',
      ellipsis: {
        showTitle: false,
      },
      render: (record) => (
        <Tooltip placement="topLeft" title={record.note}>
          {record.note} <EditFilled onClick={() => editPrompt(record)} />
        </Tooltip>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      width: 250,
      render: (record) => (
        <>
          {record.isResolved === SupportStatus.Unresolved ? (
            <>
              <Button
                onClick={() => customNotePrompt(record, SupportStatus.Resolved)}
                type="primary"
              >
                Resolved
              </Button>{' '}
              &nbsp;
              <Button
                type="primary"
                onClick={() => customNotePrompt(record, SupportStatus.InProgress)}
              >
                In Progress
              </Button>
            </>
          ) : record.isResolved === SupportStatus.InProgress ? (
            <>
              <Button
                type="primary"
                onClick={() => customNotePrompt(record, SupportStatus.Resolved)}
              >
                Resolved
              </Button>{' '}
              &nbsp;
              <Button
                type="primary"
                disabled
                onClick={() => customNotePrompt(record, SupportStatus.Unresolved)}
              >
                {' '}
                Un Resolved{' '}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                disabled
                onClick={() => customNotePrompt(record, SupportStatus.Unresolved)}
              >
                Un Resolved
              </Button>
              <Button
                type="primary"
                disabled
                onClick={() => customNotePrompt(record, SupportStatus.InProgress)}
              >
                In Progress
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Support"
      actions={
        <Button type="primary" onClick={()=>fetchData()}>
          <ReloadOutlined />
        </Button>
      }
    >
      <Modal
        title="Edit Note"
        visible={noteModalVisibality}
        onOk={onQueryStatusChange}
        onCancel={() => setNoteModalVisibality(false)}
      >
        <Input.TextArea
          placeholder="Enter Note.."
          onChange={(e) => setCustomNote(e.target.value)}
          value={customNote}
        />
      </Modal>
      <DataTable usersData={support} loading={loading} columns={columns} pagination={false} />
      <Row gutter={[8, 8]} className="p-5">
        <Col offset={21}>
          <Button
            type="primary"
            onClick={() => fetchData(`?direction=b&lastRecordId=${support[0].id}`)}
            title="Prev"
          >
            Prev
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() =>
              fetchData(`?direction=f&lastRecordId=${support[support.length - 1].id}`)}
            title="Next"
          >
            Next
          </Button>
        </Col>
      </Row>
    </HCLayout>
  );
};
