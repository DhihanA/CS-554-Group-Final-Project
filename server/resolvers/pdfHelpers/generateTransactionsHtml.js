export const generateTransactionsHtml = (transactions, userName) => {
  let rows = transactions
    .map(
      (t) => `
    <tr>
      <td>${t.sender.owner.firstName} ${t.sender.owner.lastName}</td>
      <td>${new Date(t.dateOfTransaction).toLocaleDateString("en-US")}</td>
      <td>${new Date(t.dateOfTransaction).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}</td>
      <td>${t.description}</td>
      <td>$${t.amount} USD</td>
      <td>${t.type}</td>
    </tr>
  `
    )
    .join("");

  // console.log(rows);

  return `
    <html>
    <head>
      <style>
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; background: #16213e; color: #e0e1dd; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        h1 { color: #e0e1dd; text-align: center; }
        table { width: 100%; border-collapse: collapse; background: #0f3460; border-radius: 8px; }
        th, td { padding: 12px 15px; text-align: left; color: #e0e1dd; border-bottom: 1px solid #4ecca3; }
        th { background-color: #1a1a2e; }
        tr:last-child td { border-bottom: none; }

      </style>
    </head>
    <body>
      <h1>Transactions for ${userName}</h1>
      <table>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;
};
