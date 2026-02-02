import { Typography, Card, Row, Col, Empty, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function WorkbenchPage() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            工作台
          </Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />}>
            新建项目
          </Button>
        </Col>
      </Row>

      <Card>
        <Empty
          description="暂无项目，点击上方按钮创建"
          style={{ padding: 48 }}
        >
          <Button type="primary">创建第一个项目</Button>
        </Empty>
      </Card>
    </div>
  )
}
