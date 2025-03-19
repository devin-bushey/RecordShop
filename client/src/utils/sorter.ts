export const sortByOrderNum = (tickets: any) => {
  tickets.sort((a: any, b: any) => {
    return a.orderNum - b.orderNum;
  });

  return tickets;
};

export const sortByPopularity = (tickets: any) => {
  tickets.sort((a: any, b: any) => {
    return a.popularity - b.popularity;
  });

  return tickets;
};

export const sortDataByDateAndOrder = (data: any) => {
  return data.sort((a: any, b: any) => {
    // First, compare the dates
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      // If the dates are the same, compare the orders
      return a.orderNum - b.orderNum;
    }
  });
};

export const filterRecent = (data: any) => {
  return data.filter((ticket: any) => {
    const threeDaysAgo: Date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const ticketDate = new Date(ticket.date);
    return ticketDate > threeDaysAgo;
  });
};
