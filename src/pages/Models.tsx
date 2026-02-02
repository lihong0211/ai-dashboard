import { Typography, Card, Row, Col, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function ModelsPage() {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        文本模型
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col flex="auto">
          <Input
            placeholder="搜索模型"
            prefix={<SearchOutlined />}
            style={{ maxWidth: 400 }}
          />
        </Col>
        <Col>
          <Select
            placeholder="模型类型"
            style={{ width: 150 }}
            options={[
              { label: '全部', value: 'all' },
              { label: '通用', value: 'general' },
              { label: '专用', value: 'specialized' },
            ]}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col xs={24} sm={12} md={8} key={i}>
            <Card hoverable>
              <Card.Meta
                title={`文本模型 ${i}`}
                description="适用于各类文本生成与理解任务，支持多语言"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
