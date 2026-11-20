import type { InputHTMLAttributes } from 'react'

type UploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export function Upload(props: UploadProps) {
  return <input type="file" {...props} />
}
