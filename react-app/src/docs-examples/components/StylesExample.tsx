export default function StylesExample() {
  return (
    <div>
      <h1>添加样式</h1>

      <h2>className 示例</h2>
      <pre className="code-block">{`<img className="avatar" />`}</pre>
      <pre className="code-block">{`.avatar {
  border-radius: 50%;
}`}</pre>

      <h2>内联样式示例</h2>
      <pre className="code-block">{`const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
};

<img
  className="avatar"
  src={user.imageUrl}
  alt={'Photo of ' + user.name}
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>`}</pre>

      <h2>运行效果</h2>
      <div className="example-output">
        <img
          className="avatar"
          src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
          alt="Photo of Hedy Lamarr"
          style={{ width: 90, height: 90 }}
        />
        <p>Hedy Lamarr</p>
      </div>
    </div>
  )
}