import { useState } from 'react'

interface CodeBlockProps {
  code: string
  label?: string
}

export default function CodeBlock({ code, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        {label && <span className="code-block-label">{label}</span>}
        <button
          className="code-block-copy"
          onClick={handleCopy}
          title="复制代码"
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="code-block">{code}</pre>
    </div>
  )
}