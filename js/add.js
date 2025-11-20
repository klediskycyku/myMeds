// add.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-med-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newMed = {
            name: document.getElementById('medName').value.trim(),
            generic: document.getElementById('medGeneric').value.trim(),
            strength: document.getElementById('medStrength').value.trim(),
            form: document.getElementById('medForm').value,
            category: document.getElementById('medCategory').value,
            quantity: Number(document.getElementById('medQuantity').value) || 0,
            threshold: Number(document.getElementById('medThreshold').value) || 1,
            price: Number(document.getElementById('medPrice').value) || 0,
            description: document.getElementById('medDescription').value.trim()
        };

        if (!newMed.name) {
            alert('Name is required');
            return;
        }

        addMedicationObj(newMed);
        alert('Medication added successfully');
        window.location.href = 'index.html';
    });
});