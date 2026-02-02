import { useState } from 'react'
import { Typography, Segmented, Card, Row, Col, Button, Tag } from 'antd'
import { LinkOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function DashboardPage() {
  const [segment, setSegment] = useState<string>('featured')

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        模型广场
      </Title>

      <Segmented
        value={segment}
        onChange={(v) => setSegment(v as string)}
        options={[
          { label: '精选模型', value: 'featured' },
          { label: '全部模型', value: 'all' },
        ]}
        style={{ marginBottom: 24 }}
      />

      {/* 促销横幅 */}
      <Card
        style={{
          marginBottom: 32,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: 'none',
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Tag color="blue" style={{ marginRight: 12 }}>
              OFF
            </Tag>
            <span>大模型特惠，限时优惠活动进行中</span>
          </Col>
          <Col>
            <Button type="primary" icon={<LinkOutlined />}>
              立即购买
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 首推模型 */}
      <Title level={5} style={{ marginBottom: 16 }}>
        首推模型
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={8}>
          <Card
            cover={
              <div
                style={{
                  height: 120,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Model A</span>
              </div>
            }
            extra={<Tag color="green">NEW</Tag>}
          >
            <Card.Meta
              title="推荐模型 A"
              description="高性能通用大模型，适用于多种场景"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            cover={
              <div
                style={{
                  height: 120,
                  background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Model B</span>
              </div>
            }
          >
            <Card.Meta
              title="推荐模型 B"
              description="深度思考能力，适合复杂推理任务"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            cover={
              <div
                style={{
                  height: 120,
                  background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Model C</span>
              </div>
            }
          >
            <Card.Meta
              title="推荐模型 C"
              description="多模态能力，支持图文理解"
            />
          </Card>
        </Col>
      </Row>

      {/* 深度思考 */}
      <Title level={5} style={{ marginBottom: 16 }}>
        深度思考
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={8}>
          <Card>
            <Card.Meta
              title="深度思考模型 1"
              description="适用于需要长链推理的复杂任务"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Card.Meta
              title="深度思考模型 2"
              description="增强的数学与逻辑推理能力"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Card.Meta
              title="深度思考模型 3"
              description="支持多轮对话的深度分析"
            />
          </Card>
        </Col>
      </Row>

      {/* 文本生成 */}
      <Title level={5} style={{ marginBottom: 16 }}>
        文本生成
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Card.Meta
              title="文本生成模型 1"
              description="高质量文本创作与续写"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Card.Meta
              title="文本生成模型 2"
              description="多语言支持，流畅表达"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
