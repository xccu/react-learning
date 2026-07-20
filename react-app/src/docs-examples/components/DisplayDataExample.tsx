const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://react.dev/images/docs/scientists/yXOvdOSs.jpg',
  imageSize: 90,
}

export default function DisplayDataExample() {
  return (
    <div>
      <h1>显示数据</h1>

      <h2>变量嵌入</h2>
      <pre className="code-block">{`return (
  <h1>
    {user.name}
  </h1>
);`}</pre>

      <h2>JSX 属性中的表达式</h2>
      <pre className="code-block">{`return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);`}</pre>

      <h2>字符串拼接</h2>
      <pre className="code-block">{`<img
  className="avatar"
  src={user.imageUrl}
  alt={'Photo of ' + user.name}
/>`}</pre>

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