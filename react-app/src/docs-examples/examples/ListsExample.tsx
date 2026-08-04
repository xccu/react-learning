import CodeBlock from './CodeBlock'

const products = [
  { title: '卷心菜', isFruit: false, id: 1 },
  { title: '大蒜', isFruit: false, id: 2 },
  { title: '苹果', isFruit: true, id: 3 },
]

const code = `const products = [
  { title: '卷心菜', isFruit: false, id: 1 },
  { title: '大蒜', isFruit: false, id: 2 },
  { title: '苹果', isFruit: true, id: 3 },
];

const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return <ul>{listItems}</ul>;`

export default function ListsExample() {
  const listItems = products.map(product => (
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen',
        marginBottom: '4px'
      }}
    >
      {product.title}
    </li>
  ))

  return (
    <div>
      <h1>渲染列表</h1>

      <h2>示例代码</h2>
      <CodeBlock code={code} label="tsx" />

      <h2>运行效果</h2>
      <div className="example-output">
        <ul style={{ paddingLeft: '24px' }}>{listItems}</ul>
      </div>
    </div>
  )
}