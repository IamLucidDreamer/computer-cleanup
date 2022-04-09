/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Table } from 'antd';

import './table.css';

const DataTable = (props) => {
  const {
    columns,
    usersData = [],
    loading,
    differUserRows,
    rowSelection,
    differRows,
    pagination,
  } = props;

  // useEffect(() => {
  //   console.log(usersData);
  // }, [usersData]);

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={usersData}
        loading={loading}
        rowSelection={rowSelection}
        pagination={pagination}
        rowClassName={
          differUserRows
            ? (record) => (record.userInfo?.isBanned ? 'rowDisabled' : 'default')
            : differRows
            ? (record) => (record.isBanned ? 'rowDisabled' : 'default')
            : false
        }
      />
    </>
  );
};

export { DataTable };
