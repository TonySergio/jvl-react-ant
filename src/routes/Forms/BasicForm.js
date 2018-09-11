import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip, message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';
import * as routerRedux from 'react-router-redux';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['rule/add'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'rule/add',
          payload: values,
        });

        this.props.dispatch(routerRedux.push('/list/table-list'));
        message.success('Added succesfull');

      }
    });
  };

  render() {
    const { submitting, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout
        title="Add/Edit Machine"
        content="Machines registered in the system can be use in requests and tests"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Machine serial number">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Enter machine serial',
                  },
                ],
              })(<Input placeholder="please enter..." />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Request date start - end">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: 'Should be filled',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} placeholder={['Start date', 'End date']} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Some description">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: false,
                    message: 'lll',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder=""
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Test timeout
                  <em className={styles.optional}>
                    （sec）
                    <Tooltip title="Before broken test">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('client')(
                <Input placeholder="you can override default value" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Connections
                  <em className={styles.optional}>（count）</em>
                </span>
              }
            >
              {getFieldDecorator('invites')(
                <Input placeholder="parallel connections" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Max steps in test
                  <em className={styles.optional}>（nth）</em>
                </span>
              }
            >
              {getFieldDecorator('weight')(<InputNumber placeholder="100" min={0} max={100} />)}
              <span className="ant-form-text">count</span>
            </FormItem>
            <FormItem {...formItemLayout} label="Protocol" help="how machine communicate with SAS">
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">Serial Port</Radio>
                    <Radio value="2">HTTP</Radio>
                    <Radio value="3">Secret port</Radio>
                  </Radio.Group>
                )}
                <FormItem style={{ marginBottom: 0 }}>
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder="fill port number..."
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">Client-Server</Option>
                      <Option value="2">Socket</Option>
                      <Option value="3">UDP</Option>
                    </Select>
                  )}
                </FormItem>
              </div>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Save
              </Button>
              <Button style={{ marginLeft: 8 }}>Cancel</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
