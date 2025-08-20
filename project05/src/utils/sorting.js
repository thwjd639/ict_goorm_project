export const sortExpenses = (expenses, sortType) => {
  return [...expenses].sort((a, b) => {
    switch (sortType) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'amount':
        return b.amount - a.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });
};