import { useState } from 'react'
import CodeBlock from './CodeBlock'

function AdminPanel() {
  return <div style={{ padding: '12px', background: '#fff3cd', borderRadius: '4px' }}>🔧 管理面板</div>
}

function LoginForm() {
  return <div style={{ padding: '12px', background: '#d1ecf1', borderRadius: '4px' }}>🔐 登录表单</div>
}

export default function ConditionalExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const ifElseCode = `let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return <div>{content}</div>;`
  const ternaryCode = `{isLoggedIn ? (
  <AdminPanel />
) : (
  <LoginForm />
)}`
  const logicalAndCode = `{isLoggedIn && <AdminPanel />}`

  return (
    <div>
      <h1>条件渲染</h1>

      <h2>if/else 方式</h2>
      <CodeBlock code={ifElseCode} label="tsx" />

      <h2>三元运算符</h2>
      <CodeBlock code={ternaryCode} label="tsx" />

      <h2>逻辑与运算符</h2>
      <CodeBlock code={logicalAndCode} label="tsx" />

      <h2>运行效果</h2>
      <div className="example-output">
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{ marginBottom: '12px', padding: '8px 16px', cursor: 'pointer' }}
        >
          {isLoggedIn ? '退出登录' : '登录'}
        </button>
        <div>
          {isLoggedIn ? <AdminPanel /> : <LoginForm />}
        </div>
      </div>
    </div>
  )
}