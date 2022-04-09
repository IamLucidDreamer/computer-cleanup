/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */

import React, { useEffect, useState } from 'react';
import { Button, Input, Row, Col, Tooltip, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import QS from 'query-string';
import { CSVLink } from 'react-csv';
import { HCLayout } from './Layout/HCLayout';
import { DataTable } from './Table/Table';
import { request } from '../service/common';
import './Layout/style.css';

const Inactives = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const [filters, setFilters] = useState({});

  const [page, setPage] = useState(1);

  const [nextBtnDisable, setNextBtnDisabled] = useState(false);

  const [prevBtnDisable, setPrevBtnDisabled] = useState(false);

  const [exportUsers, setExportUsers] = useState([]);

  const requestsCaller = () => {
    setLoading(true);
    request(`/api/app-user/uninstalled-users`, 'GET')
      .then(async (data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(`err ${err}`);
        throw err;
      });
  };

  const getExportUsers = () => {
    request(`/api/getAll/inactive-users`, 'GET')
      .then(async (data) => {
        setExportUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(`err ${err}`);
        throw err;
      });
  };

  const refreshTable = (queryString) => {
    setLoading(true);

    request(
      queryString
        ? `/api/app-user/uninstalled-users?${queryString}&page=${page}`
        : `/api/app-user/uninstalled-users?page=${page}`,
      'GET',
    )
      .then(async (data) => {
        // eslint-disable-next-line array-callback-return
        if (data.length > 0) {
          setNextBtnDisabled(false);

          data.map((item) => {
            item.key = item.id;
          });

          setUsers(data);
        } else {
          setNextBtnDisabled(true);
        }

        setLoading(false);
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshTable(QS.stringify(filters));
    if (page === 1) {
      setPrevBtnDisabled(true);
    } else {
      setPrevBtnDisabled(false);
    }
  }, [page]);

  const pageNext = () => {
    setPage(page + 1);
  };
  const pagePrev = () => {
    page > 1 ? setPage(page - 1) : setPage(page);
  };

  useEffect(() => {
    if (isFilterChanged) {
      refreshTable(QS.stringify(filters));
      setIsFilterChanged(false);
    }
  }, [isFilterChanged]);

  useEffect(() => {
    requestsCaller();
    getExportUsers();
  }, []);

  const paginationHandler = (direction, lastRecordId) => {
    onTableFilterChange({
      direction,
      lastRecordId,
    });
    setFilterChange();
  };

  const onTableFilterChange = (query) => {
    setFilters({ ...filters, ...query });
  };

  const setFilterChange = () => {
    setIsFilterChanged(true);
    // setFilters({ ...filters, isChanged: true });
  };

  const columns = [
    {
      key: 'Name',
      title: 'Name',
      render: (record) => record.name,
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
      key: 'Phone',
      title: 'Phone',
      render: (record) => record.phone,
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
      onFilter: (value, record) => record.phone.includes(value),
    },
    {
      key: 'gender',
      title: 'Gender',
      render: (record) => (record.gender === 2 ? 'Female' : 'Male'),
      // filters: [
      //   { text: 'Male', value: 'Male' },
      //   { text: 'Female', value: 'Female' },
      // ],
      // onFilter: (value, record) => (value === 'Male' ? record.gender === 1 : record.gender === 2),
    },
    {
      key: 'Role',
      title: 'Role',
      render: (record) => {
        if (record.role === 1) return 'Labour';
        if (record.role === 2) return 'Agent';
        if (record.role === 3) {
          return !record.millOwner.millInfo ? 'Mill Owner without mill' : 'Mill Owner';
        }
        return 'Partially Registered';
      },
    },
    {
      key: 'LastActive',
      title: 'Last Active',
      render: (record) => (
        <Tooltip
          placement="top"
          title={`${new Date(record.lastActive).toLocaleDateString()} ${new Date(
            record.lastActive,
          ).toLocaleTimeString()}`}
        >
          {`${new Date(record.lastActive).toLocaleDateString()}`}
        </Tooltip>
      ),
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
  ];

  const actionBtn = [
    <Button type="primary" className="w-44" style={{ border: 'none' }}>
      <CSVLink
        filename="Inactive-users.csv"
        data={exportUsers.map((user) => {
          const updatedUser = { ...user };
          updatedUser.registerationCompleted = !updatedUser.registerationCompleted ? 'false' : 'true';
          updatedUser.phone = `=""`.concat(updatedUser.phone, `""`);
          updatedUser.gender = updatedUser.gender === 2 ? 'Female' : 'Male';
          updatedUser.isBanned = !updatedUser.isBanned ? 'false' : 'true';
          if (updatedUser.role === 1) updatedUser.role = 'Labour';
          else if (updatedUser.role === 2) updatedUser.role = 'Agent';
          else if (updatedUser.role === 3) {
            updatedUser.role = !updatedUser.millOwner.millInfo
              ? 'Mill Owner without mill'
              : 'Mill Owner';
          } else {
            updatedUser.role = 'Partially Registered';
          }
          delete updatedUser.millOwner;
          delete updatedUser.bankDetails;
          delete updatedUser.labour;
          delete updatedUser.middleman;
          delete updatedUser.failedNotifications;
          delete updatedUser.id;
          delete updatedUser.locale;
          return updatedUser;
        })}
        onClick={() => {
          message.success('The file is downloading');
        }}
        className="w-44"
      >
        Export to CSV
      </CSVLink>
    </Button>,
  ];

  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Inactive Users"
      actions={actionBtn}
    >
      <DataTable
        usersData={users}
        searchable={false}
        differUserRows
        pagination={false}
        loading={loading}
        columns={columns}
      />
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

export { Inactives };
