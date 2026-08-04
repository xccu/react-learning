import { useState } from 'react'
import CodeBlock from './CodeBlock'

function MyButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'block', marginBottom: '10px', padding: '8px 16px' }}>
      点了 {count} 次
    </button>
  )
}

const beforeCode = `// 每个 MyButton 有自己的 count
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
}`

const afterCode = `// count 提升到父组件 MyApp
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      点了 {count} 次
    </button>
  );
}`

export default function SharingDataExample() {
  return (
    <div>
      <h1>组件间数据共享</h1>

      <h2>状态提升前（各自独立）</h2>
      <CodeBlock code={beforeCode} label="tsx" />
      <div className="example-output">
        <IndependentCounter />
      </div>

      <h2>状态提升后（共享更新）</h2>
      <CodeBlock code={afterCode} label="tsx" />
      <p>点击任一按钮，两个按钮同时更新：</p>
      <div className="example-output">
        <SharedCounter />
      </div>
    </div>
  )
}

function IndependentCounter() {
  return (
    <>
      <IndependentButton />
      <IndependentButton />
    </>
  )
}

function IndependentButton() {
  const [count, setCount] = useState(0)
  return (
    <button
      onClick={() => setCount(count + 1)}
      style={{ display: 'block', marginBottom: '10px', padding: '8px 16px' }}
    >
      点了 {count} 次
    </button>
  )
}

function SharedCounter() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
  }
  return (
    <>
      <h1>共同更新的计数器</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </>
  )
}