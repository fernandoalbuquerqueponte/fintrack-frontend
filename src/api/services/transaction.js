import queryString from 'query-string'

import { protectedApi } from '@/lib/axios'

export const TransactionService = {
  /**
   * Cria uma transação para o usuário autenticado
   * @param {Object} input - Usuário a ser criado
   * @param {string} input.name - Nome da transação
   * @param {string} input.date - Data da transação (YYYY-MM-DD)
   * @param {string} input.amount - Valor da transação
   * @param {string} input.type - Tipo da transação (EARNING/EXPENSE/INVESTMENT)
   */
  create: async (input) => {
    const response = await protectedApi.post('/transactions/me', input)

    return response.data
  },
  /**
   * Retorna as transções do usuário autenticado
   * @param {Object} input
   * @param {string} input.from - Data inicial (YYYY-MM-DD)
   * @param {string} input.to - Data final (YYYY-MM-DD)
   */
  getAll: async (input) => {
    const query = queryString.stringify({ from: input.from, to: input.to })
    const response = await protectedApi.get(`/transactions/me?${query}`)

    return response.data
  },
  /**
   * Atualiza uma transação para o usuário autenticado
   * @param {Object} input - Dados da transação
   * @param {string} input.id - Id da transação
   * @param {string} input.name - Nome da transação
   * @param {string} input.date - Data da transação (YYYY-MM-DD)
   * @param {string} input.amount - Valor da transação
   * @param {string} input.type - Tipo da transação (EARNING/EXPENSE/INVESTMENT)
   */
  update: async (input) => {
    const response = await protectedApi.patch(`/transactions/me/${input.id}`, {
      name: input.name,
      date: input.date,
      amount: input.amount,
      type: input.type,
    })

    return response.data
  },
}
