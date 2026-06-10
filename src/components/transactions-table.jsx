import { useSearchParams } from 'react-router'

import { useGetTransactions } from '@/api/hooks/transaction'

import { DataTable } from './ui/data-table'

export const columns = [
  {
    accessorKey: 'name',
    header: 'Título',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
  },
  {
    accessorKey: 'date',
    header: 'Data',
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
  },
]

const TransactionsTable = () => {
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const { data: transactions } = useGetTransactions({ from, to })

  if (!transactions) return null

  return <DataTable columns={columns} data={transactions} />
}

export default TransactionsTable
