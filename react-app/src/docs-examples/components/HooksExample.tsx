import { useState, useEffect } from 'react'

export default function HooksExample() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <div>
      <h1>使用 Hook</h1>

      <h2>Hook 使用规则</h2>
      <pre className="code-block">{`import { useState, useEffect } from 'react';

function MyComponent() {
  // ✅ 正确：在组件顶层调用 Hook
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ❌ 错误：不能在条件或循环中调用 Hook
  // if (count > 0) {
  //   useState(0);  // 这会报错！
  // }
}`}</pre>

      <h2>运行效果</h2>
      <div className="example-output">
        <p>当前计数: {count}</p>
        <p>组件已挂载: {mounted ? '是' : '否'}</p>
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          增加计数
        </button>
      </div>
    </div>
  )
}