export function getMaxAmount(data) {
    return Math.max(...data.map((c) => c.totalAmount), 1);
  }
  