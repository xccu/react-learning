function MyButton() {
  return <button>我是一个按钮</button>
}

export default function ComponentsExample() {
  return (
    <div>
      <h1>组件创建与嵌套</h1>

      <h2>示例代码</h2>
      <pre className="code-block">{`function MyButton() {
  return (
    <button>我是一个按钮</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>欢迎来到我的应用</h1>
      <MyButton />
    </div>
  );
}`}</pre>

      <h2>运行效果</h2>
      <div className="example-output">
        <h1>欢迎来到我的应用</h1>
        <MyButton />
      </div>
    </div>
  )
}