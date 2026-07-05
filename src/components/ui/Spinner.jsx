import { Loader2 } from 'lucide-react'
import cn from '../../utils/cn'

export default function Spinner({ className }) {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className={cn('h-7 w-7 animate-spin text-accent', className)} />
    </div>
  )
}
