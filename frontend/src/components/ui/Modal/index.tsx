import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button/index.tsx'

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null

  return (
    <dialog open>
      <h2>{title}</h2>
      {children}
      <Button onClick={onClose}>Close</Button>
    </dialog>
  )
}
