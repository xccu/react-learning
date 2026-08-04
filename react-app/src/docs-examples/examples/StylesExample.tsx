import CodeBlock from './CodeBlock'

export default function StylesExample() {
  const classNameCode = `<img className="avatar" />`
  const cssCode = `.avatar {
  border-radius: 50%;
}`
  const inlineStyleCode = `const user = {
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
/>`

  return (
    <div>
      <h1>添加样式</h1>

      <h2>className 示例</h2>
      <CodeBlock code={classNameCode} label="jsx" />
      <CodeBlock code={cssCode} label="css" />

      <h2>内联样式示例</h2>
      <CodeBlock code={inlineStyleCode} label="tsx" />

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