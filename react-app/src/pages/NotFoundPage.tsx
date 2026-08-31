import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

// 404 页面：使用 Ant Design Result 组件
function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在"
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  )
}

export default NotFoundPage