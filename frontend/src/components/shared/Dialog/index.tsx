import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import MuiDialog from '@mui/material/Dialog'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'

type DialogProps = {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmLabel?: string
  cancelLabel?: string
  confirming?: boolean
  confirmColor?: 'primary' | 'error'
}

export function Dialog({
  open,
  title,
  description,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  confirming = false,
  confirmColor = 'primary',
}: DialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={confirming ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 18px 48px rgba(15, 23, 42, 0.18)',
          },
        },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 2.5, pb: description ? 1 : 2 }}>
        <Typography component="span" variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75, display: 'block' }}
          >
            {description}
          </Typography>
        ) : null}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, py: 2.5 }}>{children}</DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 1.75, gap: 1 }}>
        <Button onClick={onClose} disabled={confirming} color="inherit">
          {cancelLabel}
        </Button>
        {onConfirm ? (
          <Button
            variant="contained"
            color={confirmColor}
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirmLabel}
          </Button>
        ) : null}
      </DialogActions>
    </MuiDialog>
  )
}
