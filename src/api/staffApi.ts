
// Re-export all the functions from the separated files
export { 
  fetchStaffFromApi,
  addStaffToApi,
  updateStaffInApi,
  deleteStaffFromApi
} from './staffOperations';

export {
  fetchTransactionsFromApi,
  addTransactionToApi,
  updateTransactionInApi,
  deleteTransactionFromApi
} from './transactionOperations';
