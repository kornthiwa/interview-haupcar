import { useState } from 'react'
import { Button } from '@/components/ui/Button/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { CarTable } from './CarTable.tsx'

export function CarPage() {
  const [createRequest, setCreateRequest] = useState(0)

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Cars
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCreateRequest((value) => value + 1)}
        >
          Add Car
        </Button>
      </Stack>
      <CarTable createRequest={createRequest} />
    </Stack>
  )
}
