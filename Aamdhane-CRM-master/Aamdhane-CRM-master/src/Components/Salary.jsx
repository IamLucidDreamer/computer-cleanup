/* eslint-disable react/jsx-filename-extension */
import React /* useEffect, useState */ from 'react';
// import Select from 'react-select';
// import { Menu, Dropdown, Button, Form, Input, Modal } from 'antd';
import { HCLayout } from './Layout/HCLayout';
// import { DataTable } from '../Table/Table';

// import { request } from '../../service/common';

const Salary = () => (
  // const users = [
  //   {
  //     key: 0,
  //     name: 'labour 1 ',

  //     email: 'labour@gmail.com',
  //     gender: 'Male',
  //     phone: '1234456',
  //     skill: 'skill1',
  //     userStatus: 1,
  //   },
  //   {
  //     key: 1,
  //     name: 'labour 2',

  //     email: 'labour@gmail.com',
  //     gender: 'Male',
  //     phone: '1234456',
  //     skill: 'skill1',
  //     userStatus: 0,
  //   },
  // ];

  // const [labourers, setLabourers] = useState([]);

  // const [loading, setLoading] = useState(true);

  // const [factory, setFactory] = useState(undefined);

  // const [factories, setFactories] = useState([]);

  // const [job, setJob] = useState(undefined);

  // const [jobs, setJobs] = useState([]);

  // const [checkedState, setCheckedState] = useState(new Array(users.length).fill(false));

  // const [editModalVisiblityMultipleLabourers, setEditModalVisiblityMultipleLabourers] =
  //   useState(false);

  // const [selectedLabourers, setSelectedLabourers] = useState(0);

  // const [days, setDays] = useState(undefined);

  // const [salary, setSalary] = useState(undefined);

  // const [totalSalary, setTotalSalary] = useState(undefined);

  // const menu = (
  //   <Menu>
  //     <Menu.Item style={{ padding: 0 }}>
  //       <Button className="w-44" style={{ border: 'none' }}>
  //         Export
  //       </Button>
  //       <Button
  //         disabled={!(factory && job)}
  //         className="w-44"
  //         style={{ border: 'none' }}
  //         onClick={() => onPay()}
  //       >
  //         Pay to Labourers
  //       </Button>
  //     </Menu.Item>
  //   </Menu>
  // );

  // const actionBtn = [
  //   <Dropdown overlay={menu} placement="bottomCenter">
  //     <Button className="w-44" type="primary">
  //       Actions
  //     </Button>
  //   </Dropdown>,
  // ];

  // useEffect(() => {
  //   setLoading(true);
  //   request('/api/mill', 'GET')
  //     .then(async (data) => {
  //       const temp = [];
  //       data.map((mill) => {
  //         const obj = {};
  //         obj.value = mill.id;
  //         obj.label = mill.millName;
  //         temp.push(obj);
  //         return mill;
  //       });

  //       setFactories(...factories, temp);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //     });
  // }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   request(`/api/job?millId=${factory}`, 'GET')
  //     .then(async (data) => {
  //       const temp = [];
  //       data.map((job) => {
  //         const obj = {};
  //         obj.value = job.id;
  //         obj.label = job.jobTitle;
  //         temp.push(obj);
  //         return job;
  //       });
  //       console.log(data);

  //       setJobs(temp);
  //       setJob(undefined);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //     });
  // }, [factory]);

  // useEffect(() => {
  //   if (salary === undefined || salary === null || Number.isNaN(salary) === true)
  //     setTotalSalary(days);
  //   else setTotalSalary(days * salary);
  // }, [days]);

  // useEffect(() => {
  //   if (days === undefined || days === null || Number.isNaN(days) === true) setTotalSalary(salary);
  //   else setTotalSalary(days * salary);
  // }, [salary]);

  // useEffect(() => {}, [factory, job]);

  // const onPay = () => {
  //   setEditModalVisiblityMultipleLabourers(true);
  // };

  // const confirmPayment = () => {
  //   setEditModalVisiblityMultipleLabourers(false);
  //   setDays(undefined);
  //   setSalary(undefined);
  //   setTotalSalary(undefined);
  //  request('/api/app-users?firebaseRole=Labour', 'GET')
  //   .then(async (data) => {
  //     setLabourers(data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // };

  // const onEditModalClose = () => {
  //   setEditModalVisiblityMultipleLabourers(false);
  //   setDays(undefined);
  //   setSalary(undefined);
  //   setTotalSalary(undefined);
  // };

  // const onEditModalSave = () => {
  //   setEditModalVisiblityMultipleLabourers(false);
  //   setDays(undefined);
  //   setSalary(undefined);
  //   setTotalSalary(undefined);
  // };

  // const handleOnChange = (position, currentStatus) => {
  //   const updatedCheckedState = checkedState.map((item, index) =>
  //     index === position ? !item : item,
  //   );
  //   if (currentStatus === true) setSelectedLabourers(selectedLabourers - 1);
  //   else setSelectedLabourers(selectedLabourers + 1);
  //   setCheckedState(updatedCheckedState);
  // };

  // const factoryHandler = (e) => {
  //   setFactory(e.value);
  //   setJob(undefined);
  //   console.log(e);
  // };

  // const jobHandler = (e) => {
  //   setJob(e.value);
  //   console.log(e);
  // };

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   console.log(factory);
  //   console.log(job);
  //   request(`/api/job/${job}/applications?status=Accepted`, 'GET')
  //     .then(async (data) => {
  //       console.log(data);
  //       // setLabourers(...labourers, data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const columns = [
  //   {
  //     key: 0,
  //     title: 'Select',
  //     render: (record) => (
  //       <>
  //         <input
  //           type="checkbox"
  //           checked={checkedState[record.key]}
  //           onChange={() => handleOnChange(record.key, checkedState[record.key])}
  //         />
  //       </>
  //     ),
  //   },

  //   {
  //     title: ' Name',
  //     dataIndex: 'name',
  //     editable: true,
  //   },
  //   {
  //     title: 'Email',
  //     dataIndex: 'email',
  //     editable: true,
  //   },
  //   {
  //     title: 'Gender',
  //     dataIndex: 'gender',
  //     editable: true,
  //   },
  //   {
  //     title: 'Phone',
  //     dataIndex: 'phone',
  //     editable: true,
  //   },
  //   {
  //     title: 'Skills',
  //     dataIndex: 'skill',
  //     editable: true,
  //   },

  // {
  //   key: 7,
  //   title: 'Action',
  //   render: (record) => (
  //     <>
  //       <Button type="primary" onClick={() => onPay(record)}>
  //         Pay
  //       </Button>
  //     </>
  //   ),
  // },
  // ];
  // eslint-disable-next-line react/jsx-filename-extension

  // const factData = factory || {};

  <HCLayout
    onBack={() => {
      window.location.href = '/';
    }}
    title="Pay Salary"
  >
    <center>
      <h1 style={{ fontSize: 30 }}>
        <b> Coming Soon </b>
      </h1>
    </center>

    {/* code to be used later  */}

    {/* <label>
        Factory
        <Select value={factory?.label} onChange={(e) => factoryHandler(e)} options={factories} />
      </label>
      <br />
      <label>
        Jobs
        <Select value={factData.role} onChange={(e) => setRole(e)} options={jobs} />
      </label>
      <br />
      <Button type="submit" onClick={(e) => submitHandler(e)}>
        Submit
      </Button>

      <DataTable usersData={users} columns={columns} loading={loading} />

      <Modal
        title="Pay Salary to Multiple Labourers"
        visible={editModalVisiblityMultipleLabourers}
        onCancel={onEditModalClose}
        onOk={onEditModalSave}
      >
        <Form.Item label="No. of labourers selected to be paid">
          <Input title="no_of_labourers" value={selectedLabourers} required />
        </Form.Item>

        <Form.Item label="No. of days worked">
          <Input
            title="days"
            value={days}
            placeholder="Enter no. of days"
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            required
          />
        </Form.Item>

        <Form.Item label="Salary per day per labourer">
          <Input
            title="salary"
            value={salary}
            placeholder="Enter salary per day per labourer"
            onChange={(e) => setSalary(parseInt(e.target.value, 10))}
            required
          />
        </Form.Item>

        {totalSalary !== undefined && totalSalary !== null && Number.isNaN(totalSalary) === false && (
          <Form.Item>
            <p>
              The total salary to be paid to a single labourer is <b>{totalSalary}</b>
            </p>
            <p>
              The total amount to be paid by you is <b>{totalSalary * selectedLabourers}</b>
            </p>
            <br />
            <Button type="primary" onClick={() => confirmPayment()}>
              Confirm Payment
            </Button>
          </Form.Item>
        )}
      </Modal> */}
  </HCLayout>
);
export { Salary };
