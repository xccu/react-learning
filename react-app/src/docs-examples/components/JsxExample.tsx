export default function JsxExample() {
  return (
    <div>
      <h1>JSX 语法</h1>

      <h2>示例代码</h2>
      <pre className="code-block">{`export default function AboutPage() {
  return (
    <>
      <h1>关于</h1>
      <p>你好。<br />最近怎么样？</p>
    </>
  );
}`}</pre>

      <h2>运行效果</h2>
      <div className="example-output">
        <>
          <h1>关于</h1>
          <p>你好。<br />最近怎么样？</p>
        </>
      </div>
    </div>
  )
}