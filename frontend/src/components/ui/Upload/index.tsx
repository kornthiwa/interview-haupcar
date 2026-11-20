import MuiButton from '@mui/material/Button'
import type { InputHTMLAttributes } from 'react'

type UploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
}

export function Upload({ label = 'Upload', ...props }: UploadProps) {
  return (
    <MuiButton variant="outlined" component="label">
      {label}
      <input hidden type="file" {...props} />
    </MuiButton>
  )
}
