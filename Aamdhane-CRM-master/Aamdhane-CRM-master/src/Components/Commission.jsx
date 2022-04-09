/* eslint-disable react/jsx-filename-extension */
import React /* useEffect ,  useState */ from 'react';
// import { Menu, Dropdown, Button /* Form, Input, Modal, Radio */ } from 'antd';
import { HCLayout } from './Layout/HCLayout';
// import { DataTable } from '../Table/Table';

// import { request } from '../../service/common';

// const menu = (
//   <Menu>
//     <Menu.Item style={{ padding: 0 }}>
//       <Button className="w-44" style={{ border: 'none' }}>
//         Export
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
const Commission = () => (
  // const [middleman, setMiddleman] = useState([]);

  // const [loading, setLoading] = useState(true);

  // const [editModalVisiblity, setEditModalVisiblity] = useState(false);

  // const [formulaType, setFormulaType] = useState(15);

  // const [labourers, setLabourers] = useState(15);

  // const [commissionPercentage, setCommissionPercentage] = useState(undefined);

  // const [commissionPerLabourer, setCommissionPerLabourer] = useState(undefined);

  // const [totalCommission, setTotalCommission] = useState(null);

  // useEffect(() => {
  //   setLoading(true);
  //   request('/api/app-user/users/MiddleMan', 'GET')
  //     .then(async (data) => {
  //       data.map((middleman) => {
  //         const newMiddleman = middleman;
  //         newMiddleman.key = middleman.id;
  //         return newMiddleman;
  //       });

  //       setMiddleman(data);
  //       console.log(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //     });
  // }, []);

  // useEffect(() => {
  //   setTotalCommission(labourers * commissionPerLabourer);
  // }, [commissionPerLabourer]);

  // useEffect(() => {
  //   setTotalCommission(labourers * commissionPercentage * 10);
  // }, [commissionPercentage]);

  // const onCommission = (record) => {
  //   setEditModalVisiblity(true);
  // };

  // const confirmPayment = () => {
  //   setEditModalVisiblity(true);
  // };

  // const onEditModalClose = () => {
  //   setEditModalVisiblity(false);
  //   setCommissionPercentage(undefined);
  //   setCommissionPerLabourer(undefined);
  //   setTotalCommission(undefined);
  //   setFormulaType(undefined);
  // };

  // const onEditModalSave = () => {
  //   setEditModalVisiblity(false);
  //   setCommissionPercentage(undefined);
  //   setCommissionPerLabourer(undefined);
  //   setTotalCommission(undefined);
  //   setFormulaType(undefined);
  // };

  // const users = [
  //   {
  //     key: 0,
  //     name: 'Middleman 1 ',

  //     email: 'middleman@gmail.com',
  //     gender: 'Male',
  //     phone: '1234456',
  //     states: 'state1, state2',

  //     userStatus: 1,
  //   },
  //   {
  //     key: 1,
  //     name: 'Middleman 2',

  //     email: 'middleman@gmail.com',
  //     gender: 'Male',
  //     phone: '1234456',
  //     states: 'state1, state2',
  //     userStatus: 0,
  //   },
  // ];

  // const columns = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'name',
  //     editable: true,
  //   },
  //   {
  //     title: 'Age',
  //     dataIndex: 'age',
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
  //     title: 'States',
  //     dataIndex: 'states',
  //     editable: true,
  //   },
  //   {
  //     key: 7,
  //     title: 'Action',
  //     render: (record) => (
  //       <>
  //         <Button type="primary" onClick={() => onCommission(record)}>
  //           Commission
  //         </Button>{' '}
  //       </>
  //     ),
  //   },
  // ];
  // eslint-disable-next-line react/jsx-filename-extension
  <HCLayout
    onBack={() => {
      window.location.href = '/';
    }}
    title="Agent's commission"
  >
    <center>
      <h1 style={{ fontSize: 30 }}>
        <b> Coming Soon </b>
      </h1>
    </center>

    {/* code to be used later  */}
    {/* <DataTable usersData={middleman} columns={columns} loading={loading} />
      <Modal
        title="Pay Commission to Middleman"
        visible={editModalVisiblity}
        onCancel={onEditModalClose}
        onOk={onEditModalSave}
      >
        <Form.Item label="No. of labourers under middleman">
          <Input
            title="labourers"
            value={labourers}
            placeholder="Enter no. of labourers"
            required
          />
        </Form.Item>

        <Form.Item label="Formula">
          <Radio.Group
            onChange={(e) => {
              setFormulaType(e.target.value);
              setTotalCommission(undefined);
              setCommissionPercentage(undefined);
              setCommissionPerLabourer(undefined);
            }}
            value={formulaType}
          >
            <Radio value="Through percentage">Through percentage</Radio>
            <Radio value="Through amount">Through amount</Radio>
          </Radio.Group>
        </Form.Item>

        {formulaType === 'Through percentage' && (
          <Form.Item label="Commission percentage">
            <Input
              title="commissionPercentage"
              value={commissionPercentage}
              placeholder="Enter commission percentage"
              onChange={(e) => setCommissionPercentage(parseInt(e.target.value, 10))}
              required
            />
          </Form.Item>
        )}

        {formulaType === 'Through amount' && (
          <Form.Item label="Commission per labourer">
            <Input
              title="commissionPerLabourer"
              value={commissionPerLabourer}
              placeholder="Enter commission per labourer"
              onChange={(e) => setCommissionPerLabourer(parseInt(e.target.value, 10))}
              required
            />
          </Form.Item>
        )}

        {totalCommission !== undefined &&
          totalCommission !== null &&
          Number.isNaN(totalCommission) === false && (
            <Form.Item>
              <p>
                The total commission to be paid to middleman is <b>{totalCommission}</b>
              </p>
              <br />
              <Button type="primary" onClick={() => confirmPayment()}>
                Confirm Commission
              </Button>
            </Form.Item>
          )}
      </Modal> */}
  </HCLayout>
);
export { Commission };
