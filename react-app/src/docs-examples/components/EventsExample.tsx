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

export default function EventsExample() {
  return (
    <div>
      <h1>响应事件</h1>

      <h2>示例代码</h2>
      <pre className="code-block">{`function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      点我
    </button>
  );
}`}</pre>

      <h2>运行效果</h2>
      <div className="example-output">
        <MyButton />
      </div>
    </div>
  )
}