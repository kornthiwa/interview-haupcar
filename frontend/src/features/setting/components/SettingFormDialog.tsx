import Box from '@mui/material/Box'
import { Dialog } from '@/components/shared/Dialog/index.tsx'
import { Alert } from '@/components/ui/Alert/index.tsx'
import { Input } from '@/components/ui/Input/index.tsx'
import { Select } from '@/components/ui/Select/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'

export type SettingDialogMode = 'create' | 'edit' | 'view' | 'delete'

type BrandOption = {
  value: string
  label: string
}

type SettingFormDialogProps = {
  open: boolean
  mode: SettingDialogMode | null
  entityLabel: string
  name: string
  selectedName?: string
  brandId?: string
  brandOptions?: BrandOption[]
  showBrand?: boolean
  formError: string | null
  isSaving: boolean
  onNameChange: (value: string) => void
  onBrandChange?: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}

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

export function SettingFormDialog({
  open,
  mode,
  entityLabel,
  name,
  selectedName,
  brandId = '',
  brandOptions = [],
  showBrand = false,
  formError,
  isSaving,
  onNameChange,
  onBrandChange,
  onClose,
  onConfirm,
}: SettingFormDialogProps) {
  const title =
    mode === 'create'
      ? `Create ${entityLabel}`
      : mode === 'edit'
        ? `Edit ${entityLabel}`
        : mode === 'view'
          ? `${entityLabel} details`
          : mode === 'delete'
            ? `Delete ${entityLabel}`
            : ''

  const description =
    mode === 'create'
      ? `Add a new ${entityLabel.toLowerCase()} to settings.`
      : mode === 'edit'
        ? `Update this ${entityLabel.toLowerCase()}.`
        : mode === 'view'
          ? `Read-only details for this ${entityLabel.toLowerCase()}.`
          : mode === 'delete'
            ? `This action cannot be undone.`
            : undefined

  const brandLabel =
    brandOptions.find((option) => option.value === brandId)?.label ?? brandId

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
              {selectedName}
            </Typography>
          </Box>
        ) : null}

        {mode === 'view' ? (
          <Stack spacing={1.5}>
            <DetailField label="Name" value={name} />
            {showBrand ? <DetailField label="Brand" value={brandLabel} /> : null}
          </Stack>
        ) : null}

        {mode === 'create' || mode === 'edit' ? (
          <Stack spacing={2}>
            <Input
              label="Name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              autoFocus
            />
            {showBrand ? (
              <Select
                label="Brand"
                value={brandId}
                options={brandOptions}
                onChange={(event) =>
                  onBrandChange?.(String(event.target.value))
                }
                disabled={brandOptions.length === 0}
              />
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Dialog>
  )
}
