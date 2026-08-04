import { useState } from 'react'
import CodeBlock from './CodeBlock'

function MyButton() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <button onClick={handleClick} style={{ display: 'block', marginBottom: '10px', padding: '8px 16px' }}>
      点了 {count} 次
    </button>
  )
}

const independentCode = `function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      点了 {count} 次
    </button>
  );
}`

const sharedCode = `export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>共同更新的计数器</h1>
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

export default function StateExample() {
  return (
    <div>
      <h1>State 管理</h1>

      <h2>独立计数器</h2>
      <CodeBlock code={independentCode} label="tsx" />
      <p>每个按钮维护自己的 count 状态：</p>
      <div className="example-output">
        <MyButton />
        <MyButton />
      </div>

      <h2>共同更新的计数器（状态提升）</h2>
      <CodeBlock code={sharedCode} label="tsx" />
      <p>两个按钮共享同一个 count：</p>
      <SharedCounter />
    </div>
  )
}

function SharedCounter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <div>
      <h1>共同更新的计数器</h1>
      <SharedButton count={count} onClick={handleClick} />
      <SharedButton count={count} onClick={handleClick} />
    </div>
  )
}

function SharedButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'block', marginBottom: '10px', padding: '8px 16px' }}>
      点了 {count} 次
    </button>
  )
}