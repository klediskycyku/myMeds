// main.js — shared storage + helpers

const STORAGE_KEY = 'my_meds_data_v1';

// Seed sample data if empty
function seedIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const sample = [
            { id: 1, name: "Amoxicillin", strength: "500mg", form: "Capsule", category: "Antibiotic", manufacturer: "PharmaCorp", quantity: 45, threshold: 20, price: 0.85, description: "Broad-spectrum antibiotic", addedDate: "2023-10-15" },
            { id: 2, name: "Lisinopril", strength: "10mg", form: "Tablet", category: "Antihypertensive", manufacturer: "MediLife", quantity: 12, threshold: 15, price: 0.45, description: "ACE inhibitor", addedDate: "2023-10-20" },
            { id: 3, name: "Metformin", strength: "500mg", form: "Tablet", category: "Antidiabetic", manufacturer: "DiabetesCare", quantity: 78, threshold: 25, price: 0.32, description: "Type 2 diabetes", addedDate: "2023-10-05" },
            { id: 4, name: "Ibuprofen", strength: "400mg", form: "Tablet", category: "Analgesic", manufacturer: "PainRelief Inc", quantity: 5, threshold: 10, price: 0.15, description: "NSAID", addedDate: "2023-10-25" }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    }
}

function readMedications() {
    seedIfEmpty();
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function writeMedications(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function addMedicationObj(obj) {
    const meds = readMedications();
    const id = meds.length ? Math.max(...meds.map(m => m.id)) + 1 : 1;
    obj.id = id;
    obj.addedDate = new Date().toISOString();
    meds.push(obj);
    writeMedications(meds);
    return obj;
}

function deleteMedicationById(id) {
    const meds = readMedications().filter(m => m.id !== id);
    writeMedications(meds);
}

function formatDateShort(isoOrDate) {
    const d = new Date(isoOrDate);
    return d.toLocaleDateString();
}

function getStockBadge(med) {
    if (med.quantity === 0) return 'badge-out-of-stock';
    if (med.quantity <= med.threshold) return 'badge-low-stock';
    return 'badge-in-stock';
}