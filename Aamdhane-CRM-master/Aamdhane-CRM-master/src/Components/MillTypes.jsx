/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { Collapse, List, Row, Col, Form, Input, Modal, Button, message, Skeleton } from 'antd';
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  // TranslationOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { HCLayout } from './Layout/HCLayout';
import { request } from '../service/common';
import './Layout/style.css';

const { Panel } = Collapse;

const MillTypes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [industryTypes, setIndustryTypes] = useState([]);

  const [jobTitle, setJobTitle] = useState();

  const [skill, setSkill] = useState();

  const skillInputNewIndustryForm = React.useRef();

  const jobsInputNewIndustryForm = React.useRef();

  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  const [skillsNewIndustryForm, setSkillsNewIndustryForm] = useState([]);

  const [jobTitleNewIndustryForm, setJobTitleNewIndustryForm] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    request('/api/admin-tasks/dropdown/industryType')
      .then(async (data) => {
        message.success('Data loaded');
        setIndustryTypes(data);
        setLoading(false);
      })
      .catch((err) => {
        message.error('Failed to load data');
        console.log(err);
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
    setLoading(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setLoading(false);
  };

  const actionBtn = [
    <Button type="primary" onClick={fetchData}>
      <ReloadOutlined />
    </Button>,
    <Button type="primary" onClick={showModal}>
      Add Industry Type
    </Button>,
  ];

  const addJobTitle = (millId) => {
    setLoading(true);

    request(`/api/admin-tasks/add/jobTitle/${millId}`, 'POST', {
      data: { label: jobTitle },
    })
      .then(async (data) => {
        message.success('Job Title Added');
        setJobTitle('');
        await setIndustryTypes(
          industryTypes.map((item) => {
            if (item.id !== millId) return item;
            return {
              ...item,
              jobTitle: [...item.jobTitle, data],
            };
          }),
        );
        setLoading(false);
      })
      .catch((err) => {
        message.error('Failed to Add Job Title');
        setLoading(true);
        throw err;
      });
  };

  const addSkill = (millId) => {
    setLoading(true);

    request(`/api/admin-tasks/add/skill/${millId}`, 'POST', {
      data: { label: skill },
    })
      .then(async (data) => {
        setSkill('');
        await setIndustryTypes(
          industryTypes.map((item) => {
            if (item.id !== millId) return item;
            return {
              ...item,
              skill: [...item.skill, data],
            };
          }),
        );
        message.success('Skill Added');
        setLoading(false);
      })
      .catch((err) => {
        message.error('Failed to Add Skill');
        setLoading(false);
        throw err;
      });
  };

  const removeJobTitle = (id, indId) => {
    setLoading(true);

    request(`/api/admin-tasks/jobTitle/${id}?industryTypeId=${indId}`, 'DELETE')
      .then(async () => {
        message.success('Deleted');
        setIndustryTypes(
          industryTypes.map((item) => {
            if (item.id !== indId) return item;
            return {
              ...item,
              jobTitle: item.jobTitle.filter((title) => title.id !== id),
            };
          }),
        );
        setLoading(false);
      })
      .catch((err) => {
        message.error('Failed to delete');
        setLoading(false);
        console.log(err);
      });
  };

  const removeSkill = (id, indId) => {
    setLoading(true);
    request(`/api/admin-tasks/skill/${id}?industryTypeId=${indId}`, 'DELETE')
      .then(async () => {
        message.success('Deleted');
        setIndustryTypes(
          industryTypes.map((item) => {
            if (item.id !== indId) return item;
            return {
              ...item,
              skill: item.skill.filter((currentSkill) => currentSkill.id !== id),
            };
          }),
        );
        setLoading(false);
      })
      .catch((err) => {
        message.error('Failed to delete');
        setLoading(false);

        throw err;
      });
  };

  const removeIndustry = (id) => {
    setLoading(true);

    request(`/api/admin-tasks/industryType/${id}`, 'DELETE')
      .then(async () => {
        message.success('Deleted');
        setIndustryTypes(industryTypes.filter((item) => item.id !== id));
        setLoading(false);
      })
      .catch((err) => {
        message.error('Failed to delete');
        setLoading(false);
        throw err;
      });
  };

  const onFinish = (values) => {
    setLoading(true);

    values.skill = skillsNewIndustryForm;
    values.jobTitle = jobTitleNewIndustryForm;

    request('/api/admin-tasks/add/', 'POST', {
      data: values,
    })
      .then(async (data) => {
        setIsModalVisible(false);
        data.skill = values.skill;
        data.jobTitle = values.jobTitle;
        setIndustryTypes([...industryTypes, data]);
        message.success('Industry Type created successfuly');

        setSkillsNewIndustryForm([]);
        setJobTitleNewIndustryForm([]);
        setLoading(false);
      })
      .catch((err) => {
        setSkillsNewIndustryForm([]);
        setJobTitleNewIndustryForm([]);
        message.error('Failed to create Industry Type');
        setLoading(false);

        throw err;
      });
  };

  // if form failed to save data
  const onFinishFailed = (errorInfo) => {
    console.log('Failed: ', errorInfo);
    setIsModalVisible(false);
    setSkillsNewIndustryForm([]);
    setJobTitleNewIndustryForm([]);
    setLoading(false);
  };

  const addSkillNewIndustryForm = () => {
    setSkillsNewIndustryForm([...skillsNewIndustryForm, form.getFieldValue('skill')]);
  };

  const addJobTitlesNewIndustryForm = () => {
    setJobTitleNewIndustryForm([...jobTitleNewIndustryForm, form.getFieldValue('jobTitle')]);
  };

  const removeJobTitleNewIndustryForm = (key) => {
    setJobTitleNewIndustryForm(jobTitleNewIndustryForm.filter((item) => key !== item));
  };

  const removeSkillsNewIndustryForm = (key) => {
    setSkillsNewIndustryForm(skillsNewIndustryForm.filter((item) => key !== item));
  };

  return (
    <HCLayout
      title="Industry Types"
      onBack={() => {
        window.location.href = '/';
      }}
      actions={actionBtn}
    >
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
          {industryTypes.map((industry) => (
            <Panel
              style={{ width: '100%' }}
              header={
                <span style={{ width: '100%' }}>
                  {industry.label}
                  {/* <TranslationOutlined
                    style={{
                      position: 'absolute',
                      right: 75,
                      fontSize: 20,
                      color: '#1D8EFA',
                      marginLeft: 'auto',
                    }}
                    onClick={() => translateIndustry(industry.id)}
                  /> */}

                  <MinusCircleOutlined
                    style={{
                      position: 'absolute',
                      right: 40,
                      fontSize: 20,
                      color: 'red',
                      marginLeft: 'auto',
                    }}
                    onClick={() => removeIndustry(industry.id)}
                  />
                </span>
              }
              key={industry.id}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
                <Col
                  span="12"
                  xl="12"
                  lg="12"
                  md="12"
                  xs="24"
                  sm="24"
                  style={{ height: 260, overflowY: 'scroll' }}
                >
                  <Form.Item
                    label={<b>Add Job Title</b>}
                    name="jobTitle"
                    rules={[
                      {
                        required: true,
                        message: 'Please add Job Title',
                      },
                    ]}
                  >
                    <Row>
                      <Col span="22">
                        <Input
                          type="text"
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="Add Job Title"
                        />
                      </Col>
                      <Col span="2">
                        <Button
                          htmlType="submit"
                          icon={
                            <PlusCircleOutlined
                              style={{ fontSize: 20, color: '#1890ff', width: '100%' }}
                              onClick={() => addJobTitle(industry.id)}
                            />
                          }
                          className="border-0"
                          style={{ borderRadius: 0, width: '100%' }}
                        />
                      </Col>
                    </Row>
                  </Form.Item>

                  <List
                    size="small"
                    header={
                      <Row>
                        <b>Job Titles</b>

                        <Button
                          size="medium"
                          className="ml-auto"
                          shape="rounded"
                          style={{ border: 'none' }}
                        />
                      </Row>
                    }
                    bordered
                    dataSource={industry?.jobTitle?.map((item) => item.label)}
                    renderItem={(item, i) => (
                      <List.Item
                        actions={[
                          <MinusCircleOutlined
                            style={{ color: 'red', fontSize: 18 }}
                            onClick={() => removeJobTitle(industry.jobTitle[i].id, industry.id)}
                          />,
                        ]}
                      >
                        {item}
                      </List.Item>
                    )}
                  />
                </Col>
                <Col
                  span="12"
                  xl="12"
                  md="12"
                  lg="12"
                  xs="24"
                  sm="24"
                  style={{ height: 260, overflowY: 'scroll' }}
                >
                  <Form.Item
                    label={<b>Add Skills</b>}
                    name="skills"
                    rules={[
                      {
                        required: true,
                        message: 'Please add Skills',
                      },
                    ]}
                  >
                    <Row>
                      <Col span="22">
                        <Input
                          type="text"
                          onChange={(e) => setSkill(e.target.value)}
                          placeholder="Add Skills"
                        />
                      </Col>
                      <Col span="2">
                        <Button
                          htmlType="submit"
                          icon={
                            <PlusCircleOutlined
                              style={{ fontSize: 20, color: '#1890ff', width: '100%' }}
                              onClick={() => addSkill(industry.id)}
                            />
                          }
                          className="border-0"
                          style={{ borderRadius: 0, width: '100%' }}
                        />
                      </Col>
                    </Row>
                  </Form.Item>

                  <List
                    size="small"
                    header={
                      <Row>
                        <b>Skills</b>
                        <Button
                          size="medium"
                          className="ml-auto"
                          shape="rounded"
                          style={{ border: 'none' }}
                        />
                      </Row>
                    }
                    bordered
                    dataSource={industry?.skill?.map((item) => item.label)}
                    renderItem={(item, i) => (
                      <List.Item
                        actions={[
                          <MinusCircleOutlined
                            style={{ color: 'red', fontSize: 18 }}
                            onClick={() => removeSkill(industry.skill[i].id, industry.id)}
                          />,
                        ]}
                      >
                        {item}
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Panel>
          ))}
        </Collapse>
      )}

      <Modal
        title="Add New Industry Type"
        visible={isModalVisible}
        onCancel={handleCancel}
        width={800}
        footer={[]}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 24,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={<b>Industry Type</b>}
            name="label"
            rules={[
              {
                required: true,
                message: 'Please input industry type',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter="12">
            <Col span="12" lg="12" sm="24" xs="24" style={{ height: 240, overflowY: 'scroll' }}>
              <Form.Item
                label={<b>Skills</b>}
                name="skill"
                rules={[
                  {
                    required: true,
                    message: 'Please add atleast 1 skill',
                  },
                ]}
              >
                <Row>
                  <Col span="20">
                    <Input itemRef={skillInputNewIndustryForm} style={{ borderRight: 0 }} />
                  </Col>
                  <Col span="4">
                    <Button
                      icon={
                        <PlusCircleOutlined
                          style={{ fontSize: 20, color: '#1890ff', width: '100%' }}
                        />
                      }
                      className="border-0 iconBtn"
                      style={{ borderRadius: 0, borderLeft: 0, width: 50 }}
                      onClick={addSkillNewIndustryForm}
                    />
                  </Col>
                </Row>
              </Form.Item>
              {skillsNewIndustryForm.length !== 0 ? (
                <List
                  size="small"
                  bordered
                  dataSource={skillsNewIndustryForm}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <MinusCircleOutlined
                          onClick={() => removeSkillsNewIndustryForm(item)}
                          style={{ color: 'red', fontSize: 20 }}
                        />,
                      ]}
                    >
                      {item}
                    </List.Item>
                  )}
                />
              ) : null}
            </Col>

            <Col span="12" lg="12" sm="24" xs="24" style={{ height: 240, overflowY: 'scroll' }}>
              <Form.Item
                label={<b>Job Titles</b>}
                name="jobTitle"
                rules={[
                  {
                    required: true,
                    message: 'Please add atleast 1 job title',
                  },
                ]}
              >
                <Row>
                  <Col span="20">
                    <Input itemRef={jobsInputNewIndustryForm} style={{ borderRight: 0 }} />
                  </Col>
                  <Col span="4">
                    <Button
                      icon={
                        <PlusCircleOutlined
                          style={{ fontSize: 20, color: '#1890ff', width: '100%' }}
                        />
                      }
                      className="border-0 iconBtn"
                      style={{ borderRadius: 0, borderLeft: 0 }}
                      onClick={addJobTitlesNewIndustryForm}
                      block
                    />
                  </Col>
                </Row>
              </Form.Item>
              {jobTitleNewIndustryForm.length !== 0 ? (
                <List
                  size="small"
                  bordered
                  dataSource={jobTitleNewIndustryForm}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <MinusCircleOutlined
                          onClick={() => removeJobTitleNewIndustryForm(item)}
                          style={{ color: 'red', fontSize: 20 }}
                        />,
                      ]}
                    >
                      {item}
                    </List.Item>
                  )}
                />
              ) : null}
            </Col>
          </Row>
          <Form.Item
            wrapperCol={{
              offset: 21,
              span: 20,
            }}
            style={{ paddingTop: 20 }}
          >
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </HCLayout>
  );
};

export { MillTypes };
