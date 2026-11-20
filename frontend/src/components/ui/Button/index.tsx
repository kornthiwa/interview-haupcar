import MuiButton, { type ButtonProps } from '@mui/material/Button'

export function Button({ type = 'button', ...props }: ButtonProps) {
  return <MuiButton type={type} {...props} />
}
