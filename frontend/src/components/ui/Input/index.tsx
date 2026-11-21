import TextField, { type TextFieldProps } from '@mui/material/TextField'

type InputProps = TextFieldProps & {
  readOnly?: boolean
}

export function Input({ readOnly, slotProps, ...props }: InputProps) {
  return (
    <TextField
      fullWidth
      size="small"
      {...props}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...(typeof slotProps?.htmlInput === 'object' ? slotProps.htmlInput : undefined),
          readOnly,
        },
      }}
    />
  )
}
