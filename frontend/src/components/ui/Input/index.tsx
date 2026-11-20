import TextField, { type TextFieldProps } from '@mui/material/TextField'

export function Input(props: TextFieldProps) {
  return <TextField fullWidth size="small" {...props} />
}
