import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button/index.tsx'
import { Input } from '@/components/ui/Input/index.tsx'
import { Stack } from '@/components/ui/Stack/index.tsx'

type SearchFormProps = {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
}

export function SearchForm({
  onSearch,
  placeholder = 'Search',
  defaultValue = '',
}: SearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSearch(String(data.get('q') ?? '').trim())
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Input
          name="q"
          type="search"
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-label={placeholder}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
      </Stack>
    </form>
  )
}
