import MenuItem from '@mui/material/MenuItem'
import TextField, { type TextFieldProps } from '@mui/material/TextField'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = Omit<TextFieldProps, 'select' | 'children'> & {
  options: SelectOption[]
}

export function Select({ options, ...props }: SelectProps) {
  return (
    <TextField fullWidth select size="small" {...props}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
