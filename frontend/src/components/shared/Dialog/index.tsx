import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MuiDialog from '@mui/material/Dialog'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button/index.tsx'

type DialogProps = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmLabel?: string
  cancelLabel?: string
  confirming?: boolean
}

export function Dialog({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  confirming = false,
}: DialogProps) {
  return (
    <MuiDialog
      open={open}
      onClose={confirming ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={confirming}>
          {cancelLabel}
        </Button>
        {onConfirm ? (
          <Button variant="contained" onClick={onConfirm} disabled={confirming}>
            {confirmLabel}
          </Button>
        ) : null}
      </DialogActions>
    </MuiDialog>
  )
}
