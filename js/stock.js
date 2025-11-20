// stock.js
document.addEventListener('DOMContentLoaded', () => {
    renderStockList();
    document.getElementById('search').addEventListener('input', renderStockList);
    document.getElementById('filterCategory').addEventListener('change', renderStockList);
    document.getElementById('refreshBtn').addEventListener('click', renderStockList);
});

function renderStockList() {
    const meds = readMedications();
    const q = (document.getElementById('search').value || '').toLowerCase();
    const cat = document.getElementById('filterCategory').value;

    let filtered = meds.filter(m => {
        if (q && !(`${m.name} ${m.generic}`.toLowerCase().includes(q))) return false;
        if (cat && m.category !== cat) return false;
        return true;
    });

    const container = document.getElementById('medications-list');
    if (!filtered.length) {
        container.innerHTML = '<div class="col-12 text-center py-5"><h5 class="text-muted">No medications found</h5></div>';
        return;
    }

    container.innerHTML = filtered.map(m => `
    <div class="col-md-4">
      <div class="card p-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 class="mb-0">${m.name}</h5>
            <div class="text-muted small">${m.generic} • ${m.strength}</div>
          </div>
          <div class="text-end">
            <span class="${getStockBadge(m)}">${m.quantity}</span>
            <div class="text-muted small">${m.form}</div>
          </div>
        </div>

        <p class="small text-muted mb-2">${m.category} • ${m.manufacturer || ''}</p>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${m.id}"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${m.id}"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');

    // attach handlers
    container.querySelectorAll('button[data-action]').forEach(btn => {
        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;
        btn.addEventListener('click', () => {
            if (action === 'delete') {
                if (confirm('Delete this medication?')) {
                    deleteMedicationById(id);
                    renderStockList();
                }
            } else if (action === 'edit') {
                // simple edit: redirect to add page with ?edit=id (not implemented fully)
                alert('Edit feature not implemented in this simple build. I can add it if you want.');
            }
        });
    });
}