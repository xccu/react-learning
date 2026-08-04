import CodeBlock from './CodeBlock'

function MyButton() {
  function handleClick() {
    alert('You clicked me!')
  }

  return (
    <button onClick={handleClick}>
      点我
    </button>
  )
}

const code = `function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      点我
    </button>
  );
}`

export default function EventsExample() {
  return (
    <div>
      <h1>响应事件</h1>

      <h2>示例代码</h2>
      <CodeBlock code={code} label="tsx" />

      <h2>运行效果</h2>
      <div className="example-output">
        <MyButton />
      </div>
    </div>
  )
}