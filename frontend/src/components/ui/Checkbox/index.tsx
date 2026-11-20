import MuiCheckbox, { type CheckboxProps } from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

type CheckboxFieldProps = CheckboxProps & {
  label?: string
}

export function Checkbox({ label, ...props }: CheckboxFieldProps) {
  const control = <MuiCheckbox {...props} />
  if (!label) return control

  return <FormControlLabel control={control} label={label} />
}
