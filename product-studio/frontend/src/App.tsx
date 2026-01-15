import React, { useEffect, useState } from 'react';
import { Layout, Menu, Table, Button, Modal, Form, Input, Card, Typography, Space, Tag } from 'antd';
import axios from 'axios';

const { Header, Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const API_URL = 'http://localhost:3000/api';

interface AppData {
  id: string;
  name: string;
  createdAt: string;
}

const App: React.FC = () => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);

  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API_URL}/apps`);
      setApps(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCreate = async (values: { name: string }) => {
    try {
      await axios.post(`${API_URL}/apps`, values);
      setIsModalOpen(false);
      form.resetFields();
      fetchApps();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: 'App Name', dataIndex: 'name', key: 'name' },
    { title: 'App ID', dataIndex: 'id', key: 'id', render: (text: string) => <Text copyable>{text}</Text> },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (text: string) => new Date(text).toLocaleDateString() },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: AppData) => (
        <Button type="link" onClick={() => setSelectedApp(record)}>Details</Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Product Studio Admin</div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            items={[{ key: '1', label: 'Apps' }]}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {selectedApp ? (
              <div>
                <Button onClick={() => setSelectedApp(null)} style={{ marginBottom: 16 }}>Back</Button>
                <Title level={3}>{selectedApp.name}</Title>
                <Card title="Integration Snippet" style={{ marginTop: 16 }}>
                  <Paragraph>Copy and paste this code into your application:</Paragraph>
                  <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
{`<script type="module">
  import { init } from 'https://cdn.example.com/product-studio.js';
  
  init({
    appId: '${selectedApp.id}',
    apiEndpoint: 'http://localhost:3000/api'
  });
</script>`}
                  </pre>
                </Card>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Title level={3}>Applications</Title>
                  <Button type="primary" onClick={() => setIsModalOpen(true)}>Create App</Button>
                </div>
                <Table dataSource={apps} columns={columns} rowKey="id" />
              </>
            )}
          </Content>
        </Layout>
      </Layout>

      <Modal title="Create New App" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item name="name" label="App Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Create</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;
