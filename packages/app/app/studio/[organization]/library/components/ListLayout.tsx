'use client'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import TableCells from './TableCells'
import { IExtendedSession, eSort } from '@/lib/types'
import EmptyLibrary from './EmptyLibrary'
import LayoutSelection from './LayoutSelection'
import TableSort from '@/components/misc/TableSort'
const ListLayout = ({
  sessions,
  organizationId,
  organizationSlug,
}: {
  sessions: IExtendedSession[]
  organizationId: string
  organizationSlug: string
}) => {
  if (!sessions || sessions.length === 0) {
    return (
      <EmptyLibrary
        organizationId={organizationId}
        organizationSlug={organizationSlug}
      />
    )
  }

  return (
    <Table className="bg-white">
      <TableHeader className="sticky top-0 z-50 bg-white">
        <TableRow className="hover:bg-white">
          <TableHead className="cursor-pointer">
            <TableSort title="Title" sortBy="name" />
          </TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead className="cursor-pointer">
            <TableSort title="Created at" sortBy="date" />
          </TableHead>
          <TableHead>IPFS Hash</TableHead>
          <TableHead>
            <LayoutSelection />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-scroll">
        {sessions.map((item) => (
          <TableRow key={item._id}>
            <TableCells item={item} organization={organizationSlug} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ListLayout
