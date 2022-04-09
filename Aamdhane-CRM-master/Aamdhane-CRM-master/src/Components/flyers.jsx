/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Row, Col, Image, Divider, Modal } from 'antd';
import Select from 'react-select';
import { CloseOutlined, InboxOutlined, ReloadOutlined } from '@ant-design/icons';

import { HCLayout } from './Layout/HCLayout';
// import { AuthContext } from '../context/Authcontext';

import { request } from '../service/common';

const { Dragger } = Upload;
const style = { padding: '8px 0' };

const Flyers = () => {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState({});
  const [files, setFiles] = useState([]);
  // const { userContext } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
  };

  const languages = [
    {
      value: '1',
      label: 'English',
    },
    {
      value: '2',
      label: 'Hindi',
    },
    {
      value: '3',
      label: 'Tamil',
    },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();

    // const formData = new FormData();
    // eslint-disable-next-line no-restricted-syntax
    // for (const file of files) {
    //   formData.append('image', file);
    // }
    // const fileObj=[];
    // // eslint-disable-next-line no-restricted-syntax
    // for (const file of files) {
    //   fileObj.push(file.originFileObj)
    // }
    request('/api/flyer', 'POST', { 
      formData: { image: files[files.length - 1].originFileObj, language: language.value }
     })
      .then((res) => {
        console.log(res);
        setFiles([]);
        setLanguage({});
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const uploaderProps = {
    name: 'file',
    multiple: true,
    beforeUpload: () => false,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        setFiles(info.fileList);
      }
      // if (status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure, you want to delete',
      okText: 'Yes, Delete',
      onOk: () => {
        setLoading(true);
        request(`/api/user/${record.id}`, 'DELETE')
          .then(async () => {
            setUsers(
              users.map((user) => (user.id === record.id ? { ...user, isBanned: true } : user)),
            );
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            throw err;
          });
      },
    });
  };
  // const fileSelectedHandler = (e) => {
  //   setFiles(e.target.files);
  // };

  const actionBtn = [
    <Button type="primary" onClick={fetchData}>
      <ReloadOutlined />
    </Button>,
  ];
  return (
    <HCLayout
      onBack={() => {
        window.location.href = '/';
      }}
      title="Flyers"
      actions={actionBtn}
    >
      <label>
        Language
        <Select
          style={{ zIndex: 99 }}
          className="z-50"
          value={language.label}
          onChange={(e) => setLanguage(e)}
          options={languages}
        />
      </label>
      <Dragger {...uploaderProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag flyers to this area to upload</p> 
        {/* <p className="ant-upload-hint">Support for a single or bulk upload.</p> */}
      </Dragger>
      {/* <form>
        <div>
          <h2>Upload images</h2>
        </div>
        <h3>Images</h3>
        <input type="file" name="image" multiple onChange={(e) => fileSelectedHandler(e)} />
      </form> */}
      <Button onClick={handleSubmit}>Add Flyer</Button>
      <Divider />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={6}>
          <div className="shadow-lg" style={style}>
            <Button
              type="default"
              onClick={() => onDelete()}
              style={{ width: 60, position: 'absolute', zIndex: 2, right: 0, top: 0 }}
            >
              <CloseOutlined style={{ fontSize: 16 }} />{' '}
            </Button>
            <Image src="https://aamdhane.com/images/logo.png" />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="shadow-lg" style={style}>
            <Button
              type="default"
              onClick={() => onDelete()}
              style={{ width: 60, position: 'absolute', zIndex: 2, right: 0, top: 0 }}
            >
              <CloseOutlined style={{ fontSize: 16 }} />{' '}
            </Button>
            <Image src="https://aamdhane.com/images/logo.png" />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="shadow-lg" style={style}>
            <Button
              type="default"
              onClick={() => onDelete()}
              style={{ width: 60, position: 'absolute', zIndex: 2, right: 0, top: 0 }}
            >
              <CloseOutlined style={{ fontSize: 16 }} />{' '}
            </Button>
            <Image src="https://aamdhane.com/images/logo.png" />
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="shadow-lg" style={style}>
            <Button
              type="default"
              onClick={() => onDelete()}
              style={{ width: 60, position: 'absolute', zIndex: 2, right: 0, top: 0 }}
            >
              <CloseOutlined style={{ fontSize: 16 }} />{' '}
            </Button>
            <Image src="https://aamdhane.com/images/logo.png" />
          </div>
        </Col>
      </Row>
    </HCLayout>
  );
};

export { Flyers };
