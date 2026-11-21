import Box from '@mui/material/Box'
import { Dialog } from '@/components/shared/Dialog/index.tsx'
import { Alert } from '@/components/ui/Alert/index.tsx'
import { Input } from '@/components/ui/Input/index.tsx'
import { Select } from '@/components/ui/Select/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import type { CarStatus } from '../types/index.ts'

export type CarDialogMode = 'create' | 'edit' | 'view' | 'delete'

export type CarFormValues = {
  licensePlate: string
  color: string
  pricePerDay: string
  status: CarStatus
  rentalDate: string
  dueDate: string
  notes: string
  typeId: string
  carModelId: string
}

type Option = {
  value: string
  label: string
}

type CarFormDialogProps = {
  open: boolean
  mode: CarDialogMode | null
  values: CarFormValues
  selectedLabel?: string
  typeOptions: Option[]
  carModelOptions: Option[]
  formError: string | null
  isSaving: boolean
  onChange: (field: keyof CarFormValues, value: string) => void
  onClose: () => void
  onConfirm: () => void
}

const STATUS_OPTIONS: Option[] = [
  { value: 'available', label: 'Available' },
  { value: 'rented', label: 'Rented' },
  { value: 'maintenance', label: 'Maintenance' },
]

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 2,
        bgcolor: 'action.hover',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

function optionLabel(options: Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

export function CarFormDialog({
  open,
  mode,
  values,
  selectedLabel,
  typeOptions,
  carModelOptions,
  formError,
  isSaving,
  onChange,
  onClose,
  onConfirm,
}: CarFormDialogProps) {
  const title =
    mode === 'create'
      ? 'Create Car'
      : mode === 'edit'
        ? 'Edit Car'
        : mode === 'view'
          ? 'Car details'
          : mode === 'delete'
            ? 'Delete Car'
            : ''

  const description =
    mode === 'create'
      ? 'Add a new car to the fleet.'
      : mode === 'edit'
        ? 'Update this car.'
        : mode === 'view'
          ? 'Read-only details for this car.'
          : mode === 'delete'
            ? 'This action cannot be undone.'
            : undefined

  return (
    <Dialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      onConfirm={mode === 'view' ? undefined : onConfirm}
      confirmLabel={mode === 'delete' ? 'Delete' : 'Save'}
      cancelLabel={mode === 'view' ? 'Close' : 'Cancel'}
      confirming={isSaving}
      confirmColor={mode === 'delete' ? 'error' : 'primary'}
    >
      <Stack spacing={2}>
        {formError ? <Alert severity="error">{formError}</Alert> : null}

        {mode === 'delete' ? (
          <Box
            sx={{
              px: 2,
              py: 2,
              borderRadius: 2,
              bgcolor: 'error.main',
              color: 'error.contrastText',
              opacity: 0.95,
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              You are about to delete
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedLabel}
            </Typography>
          </Box>
        ) : null}

        {mode === 'view' ? (
          <Stack spacing={1.5}>
            <DetailField label="License Plate" value={values.licensePlate} />
            <DetailField label="Color" value={values.color} />
            <DetailField label="Price / Day" value={values.pricePerDay} />
            <DetailField
              label="Status"
              value={optionLabel(STATUS_OPTIONS, values.status)}
            />
            <DetailField label="Rental Date" value={values.rentalDate} />
            <DetailField label="Due Date" value={values.dueDate} />
            <DetailField label="Notes" value={values.notes} />
            <DetailField
              label="Car Type"
              value={optionLabel(typeOptions, values.typeId)}
            />
            <DetailField
              label="Car Model"
              value={optionLabel(carModelOptions, values.carModelId)}
            />
          </Stack>
        ) : null}

        {mode === 'create' || mode === 'edit' ? (
          <Stack spacing={2}>
            <Input
              label="License Plate"
              value={values.licensePlate}
              onChange={(event) => onChange('licensePlate', event.target.value)}
              autoFocus
            />
            <Input
              label="Color"
              value={values.color}
              onChange={(event) => onChange('color', event.target.value)}
            />
            <Input
              label="Price / Day"
              type="number"
              value={values.pricePerDay}
              onChange={(event) => onChange('pricePerDay', event.target.value)}
              slotProps={{ htmlInput: { min: 1, step: 1 } }}
            />
            <Select
              label="Status"
              value={values.status}
              options={STATUS_OPTIONS}
              onChange={(event) =>
                onChange('status', String(event.target.value))
              }
            />
            <Input
              label="Rental Date"
              type="date"
              value={values.rentalDate}
              onChange={(event) => onChange('rentalDate', event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Input
              label="Due Date"
              type="date"
              value={values.dueDate}
              onChange={(event) => onChange('dueDate', event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Input
              label="Notes"
              value={values.notes}
              onChange={(event) => onChange('notes', event.target.value)}
              multiline
              minRows={2}
            />
            <Select
              label="Car Type"
              value={values.typeId}
              options={typeOptions}
              onChange={(event) => onChange('typeId', String(event.target.value))}
              disabled={typeOptions.length === 0}
            />
            <Select
              label="Car Model"
              value={values.carModelId}
              options={carModelOptions}
              onChange={(event) =>
                onChange('carModelId', String(event.target.value))
              }
              disabled={carModelOptions.length === 0}
            />
          </Stack>
        ) : null}
      </Stack>
    </Dialog>
  )
}
