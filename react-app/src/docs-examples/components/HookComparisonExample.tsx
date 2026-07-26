import { useState, useEffect, useContext, useRef, createContext } from 'react'
import CodeBlock from './CodeBlock'

const ThemeContext = createContext('light')

const code = `import { useState, useEffect, useContext, useRef } from 'react';

const ThemeContext = createContext('light');

function HookComparison() {
  // useState: 状态变化 → 触发重渲染 → UI 更新
  const [count, setCount] = useState(0);

  // useEffect: 依赖变化 → 执行副作用 → 与外部同步
  useEffect(() => {
    console.log('count 变为:', count);
  }, [count]);

  // useContext: 读取祖先组件的共享值
  const theme = useContext(ThemeContext);

  // useRef: 持有可变值 → 不触发重渲染 → UI 不变
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;

  return (
    <div className={theme}>
      <p>count: {count}</p>
      <p>theme: {theme}</p>
      <p>渲染次数: {renderCountRef.current}</p>
      <button onClick={() => setCount(c => c + 1)}>
        点击（count +1，触发 useEffect 和重渲染）
      </button>
    </div>
  );
}`

const useStateCode = `// useState: 管理组件内部状态，变化时触发重渲染
const [count, setCount] = useState(0);
setCount(count + 1);  // 调用后 UI 立即更新`

const useEffectCode = `// useEffect: 依赖变化时执行副作用，与外部系统同步
useEffect(() => {
  console.log('count 变为:', count);
}, [count]);  // count 变化时执行`

const useContextCode = `// useContext: 读取祖先组件的共享值，无需逐层传 props
const theme = useContext(ThemeContext);
// 值由 <ThemeContext.Provider value="dark"> 提供`

const useRefCode = `// useRef: 持有可变值，修改时不触发重渲染
const renderCountRef = useRef(0);
renderCountRef.current += 1;  // 值变了，但 UI 不变`

export default function HookComparisonExample() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')
  const renderCountRef = useRef(0)
  const [effectLog, setEffectLog] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const msg = `count 变为: ${count}`
    setEffectLog(prev => [...prev, msg])
  }, [count])

  renderCountRef.current += 1

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light')
  }

  return (
    <div>
      <h1>四种 Hook 效果对比</h1>

      <h2>useState - 状态管理</h2>
      <CodeBlock code={useStateCode} label="tsx" />
      <p>调用 setCount 后，count 变化，触发组件重渲染，UI 更新：</p>

      <h2>useEffect - 副作用同步</h2>
      <CodeBlock code={useEffectCode} label="tsx" />
      <p>count 变化时，effect 执行，打印日志：</p>

      <h2>useContext - 跨组件共享</h2>
      <CodeBlock code={useContextCode} label="tsx" />
      <p>点击切换主题，模拟 Context 值变化：</p>

      <h2>useRef - 引用持有</h2>
      <CodeBlock code={useRefCode} label="tsx" />
      <p>每次渲染 renderCountRef 自增，但不会触发重渲染：</p>

      <h2>运行效果</h2>
      <div className="example-output" style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff', padding: '20px', borderRadius: '8px' }}>
        <p><strong>useState</strong> - count: <span style={{ color: '#007bff', fontWeight: 'bold' }}>{count}</span>（变化时 UI 更新）</p>
        <p><strong>useEffect</strong> - 执行日志：</p>
        <div style={{ maxHeight: '120px', overflowY: 'auto', background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
          {effectLog.length === 0 ? <span style={{ color: '#999' }}>暂无日志</span> : effectLog.map((log, i) => (
            <div key={i} style={{ fontSize: '14px', color: '#28a745' }}>{log}</div>
          ))}
        </div>
        <p><strong>useContext</strong> - 主题: <span style={{ color: '#6f42c1', fontWeight: 'bold' }}>{theme}</span>（由 Provider 控制）</p>
        <p><strong>useRef</strong> - 渲染次数: <span style={{ color: '#fd7e14', fontWeight: 'bold' }}>{renderCountRef.current}</span>（值变化但 UI 不重渲染）</p>
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{ display: 'block', marginRight: '10px', marginBottom: '10px', padding: '8px 16px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            点击（count +1，触发 useEffect 和重渲染）
          </button>
          <button
            onClick={toggleTheme}
            style={{ display: 'block', marginBottom: '10px', padding: '8px 16px', cursor: 'pointer', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            切换主题（模拟 Context 变化）
          </button>
        </div>
      </div>
    </div>
  )
}