import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button/index.tsx'
import { Input } from '@/components/ui/Input/index.tsx'

type SearchFormProps = {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchForm({
  onSearch,
  placeholder = 'Search',
}: SearchFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSearch(String(data.get('q') ?? ''))
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <Input
        name="q"
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
