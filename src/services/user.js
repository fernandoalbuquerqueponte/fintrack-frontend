import { protectedApi, publicApi } from '@/lib/axios'

export const UserService = {
  /**
   * Cria um novo usuário
   * @param {Object} input - Usuário a ser criado
   * @param {string} input.first_name - Nome do usuário
   * @param {string} input.last_name - Sobrenome do usuário
   * @param {string} input.email - E-mail do usuário
   * @param {string} input.password - Senha do usuário
   * @returns {Object} Usuário a ser criado
   * @returns {string} response.tokens - Tokens de autenticação
   */
  signup: async (input) => {
    const response = await publicApi.post('/users', {
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
    })
    return {
      id: response.data.id,
      email: response.data.email,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      tokens: response.data.tokens,
    }
  },
  /**
   * Faz login do usuário
   * @param {Object} input - Usuário a ser criado
   * @param {string} input.email - E-mail do usuário
   * @param {string} input.password - Senha do usuário
   * @returns {Object} Usuário autenticado
   * @returns {string} response.tokens - Tokens de autenticação
   */
  login: async (input) => {
    const response = await publicApi.post('/users/login', {
      email: input.email,
      password: input.password,
    })
    return {
      id: response.data.id,
      email: response.data.email,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
      tokens: response.data.tokens,
    }
  },
  /**
   * Retorna o usuário autenticado
   * @returns {Object} Usuário autenticado
   */
  me: async () => {
    const response = await protectedApi.get('/users/me')
    return {
      id: response.data.id,
      email: response.data.email,
      firstName: response.data.first_name,
      lastName: response.data.last_name,
    }
  },
}
