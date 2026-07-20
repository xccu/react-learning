import CodeBlock from './CodeBlock'

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
}

export default function DisplayDataExample() {
  const variableEmbedCode = `return (
  <h1>
    {user.name}
  </h1>
);`
  const jsxExpressionCode = `return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);`
  const stringConcatCode = `<img
  className="avatar"
  src={user.imageUrl}
  alt={'Photo of ' + user.name}
/>`

  return (
    <div>
      <h1>显示数据</h1>

      <h2>变量嵌入</h2>
      <CodeBlock code={variableEmbedCode} label="tsx" />

      <h2>JSX 属性中的表达式</h2>
      <CodeBlock code={jsxExpressionCode} label="tsx" />

      <h2>字符串拼接</h2>
      <CodeBlock code={stringConcatCode} label="jsx" />

      <h2>运行效果</h2>
      <div className="example-output">
        <h1>{user.name}</h1>
        <img
          className="avatar"
          src={user.imageUrl}
          alt={`Photo of ${user.name}`}
          style={{ width: user.imageSize, height: user.imageSize, borderRadius: '50%' }}
        />
      </div>
    </div>
  )
}