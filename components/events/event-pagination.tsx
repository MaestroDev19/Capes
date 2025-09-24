"use client"

import { Button } from "@/components/ui/button"

type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function EventPagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}


