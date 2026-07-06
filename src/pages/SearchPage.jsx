import { useState } from 'react'
import Page from '../components/layout/Page'
import Card from '../components/ui/Card'
import SearchInput from '../components/ui/SearchInput'
import SearchResults from '../components/search/SearchResults'
import useDebounce from '../hooks/useDebounce'

/* Full-screen app-style master search (mobile entry point). */
export default function SearchPage() {
  const [term, setTerm] = useState('')
  const q = useDebounce(term)

  return (
    <Page title="Search" back>
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <SearchInput
          value={term}
          onChange={setTerm}
          placeholder="Search customers, vehicles, jobs…"
        />
        <Card className="p-0">
          <SearchResults q={q} />
        </Card>
      </div>
    </Page>
  )
}
