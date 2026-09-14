import { Button, Result } from 'antd'
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

function UnauthorizedPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f5f5f5',
    }}>
      <Result
        status="403"
        title="403"
        subTitle="您没有权限访问此页面"
        extra={
          <>
            <Button type="primary" onClick={handleGoHome} icon={<HomeOutlined />}>
              返回首页
            </Button>
            <Button onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
              返回
            </Button>
          </>
        }
      />
    </div>
  )
}

export default UnauthorizedPage