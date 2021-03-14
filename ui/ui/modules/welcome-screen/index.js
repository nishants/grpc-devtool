import React from "react";
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const WelcomeScreenContainer = ({openProject, createNewProject}) => {
  return <div className="welcome-screen">
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
    ><Form.Item {...tailLayout}>
      <Button type="primary" htmlType="submit" onClick={openProject}>
        Open Project
      </Button>
      <Form.Item {...tailLayout}>
        <Button type="secondary" htmlType="submit" onClick={createNewProject}>
          Create Project
        </Button>
      </Form.Item>
    </Form.Item>
    </Form>
  </div>;
};

export default WelcomeScreenContainer;
