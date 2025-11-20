//dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    //document.getElementById('export-data').addEventListener('click', exportData);
    //document.getElementById('print-report').addEventListener('click', () => window.print());
});

function renderDashboard() {
    const meds = readMedications();
    const total = meds.length;
    const inStock = meds.filter(m => m.quantity > m.threshold).length;
    const lowStock = meds.filter(m => m.quantity <= m.threshold && m.quantity > 0).length;
    const outStock = meds.filter(m => m.quantity === 0).length;

    const cardsRow = document.getElementById('cards-row');
    cardsRow.innerHTML = `
    <div class="col-md-3">
      <div class="card p-3 bg-primary text-white">
        <div>Total Medications</div><h3>${total}</h3>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card p-3 bg-success text-white">
        <div>In Stock</div><h3>${inStock}</h3>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card p-3 bg-warning text-dark">
        <div>Low Stock</div><h3>${lowStock}</h3>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card p-3 bg-danger text-white">
        <div>Out of Stock</div><h3>${outStock}</h3>
      </div>
    </div>
  `;

    // low stock list
    const lowListEl = document.getElementById('low-stock-list');
    const lowItems = meds.filter(m => m.quantity <= m.threshold);
    lowListEl.innerHTML = lowItems.length ? lowItems.map(m => `
    <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div>
        <strong>${m.name}</strong><div class="text-muted small">${m.category} • ${m.form}</div>
      </div>
      <div class="text-end">
        <span class="${getStockBadge(m)}">${m.quantity} left</span>
        <div class="text-muted small">Threshold: ${m.threshold}</div>
      </div>
    </div>
  `).join('') : '<p class="text-muted">All medications are well stocked!</p>';

    // recent meds
    const recentEl = document.getElementById('recent-list');
    const recent = [...meds].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)).slice(0, 5);
    recentEl.innerHTML = recent.map(m => `
    <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div><strong>${m.name}</strong><div class="text-muted small">${m.category}</div></div>
      <div class="text-end"><span class="${getStockBadge(m)}">${m.quantity}</span><div class="text-muted small">${formatDateShort(m.addedDate)}</div></div>
    </div>
  `).join('');

    // chart
    renderChart(meds);
}

function renderChart(meds) {
    const inStock = meds.filter(m => m.quantity > m.threshold).length;
    const lowStock = meds.filter(m => m.quantity <= m.threshold && m.quantity > 0).length;
    const outStock = meds.filter(m => m.quantity === 0).length;
    const ctx = document.getElementById('stockChart').getContext('2d');

    if (window._stockChart) window._stockChart.destroy();

    window._stockChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [{
                data: [inStock, lowStock, outStock],
                backgroundColor: ['rgba(76,201,240,0.8)', 'rgba(247,37,133,0.8)', 'rgba(230,57,70,0.8)']
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } },
        }
    });
}

function exportData() {
    const data = readMedications();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'my-meds-export.json';
    a.click();
}