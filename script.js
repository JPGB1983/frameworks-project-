// Jobs-to-be-Done Framework JavaScript
class JobsFramework {
    constructor() {
        this.formData = this.loadData();
        this.initializeForm();
        this.setupEventListeners();
        this.setupAutoSave();
    }

    initializeForm() {
        // Load saved data into form fields
        if (this.formData) {
            this.populateForm(this.formData);
        }
    }

    setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveData());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToPDF());
        }

        // Form change listeners
        const form = document.getElementById('jobsForm');
        if (form) {
            form.addEventListener('change', () => this.autoSave());
            form.addEventListener('input', () => this.autoSave());
        }
    }

    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            this.autoSave();
        }, 30000);
    }

    autoSave() {
        const formData = this.collectFormData();
        localStorage.setItem('jobsFrameworkData', JSON.stringify(formData));
    }

    saveData() {
        const formData = this.collectFormData();
        localStorage.setItem('jobsFrameworkData', JSON.stringify(formData));

        this.showSavedIndicator();
        console.log('Data saved successfully');
    }

    loadData() {
        try {
            const data = localStorage.getItem('jobsFrameworkData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    collectFormData() {
        const form = document.getElementById('jobsForm');
        if (!form) return {};

        const formData = {};

        // Text inputs and textareas
        const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], textarea, select');
        textInputs.forEach(input => {
            formData[input.id || input.name] = input.value;
        });

        // Checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            formData[checkbox.id || checkbox.name] = checkbox.checked;
        });

        // Radio buttons
        const radioGroups = {};
        const radios = form.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            if (!radioGroups[radio.name]) {
                radioGroups[radio.name] = null;
            }
            if (radio.checked) {
                radioGroups[radio.name] = radio.value;
            }
        });
        Object.assign(formData, radioGroups);

        return formData;
    }

    populateForm(data) {
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);

            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = data[key];
                } else if (element.type === 'radio') {
                    if (element.value === data[key]) {
                        element.checked = true;
                    }
                } else {
                    element.value = data[key];
                }
            }
        });
    }

    exportToPDF() {
        // Fill in any empty fields with placeholder text
        this.fillEmptyFields();

        // Trigger browser print dialog
        window.print();
    }

    fillEmptyFields() {
        const form = document.getElementById('jobsForm');
        if (!form) return;

        const textInputs = form.querySelectorAll('input[type="text"], textarea');
        textInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.border = '1px dashed #ccc';
                input.setAttribute('placeholder', 'Campo por completar');
            }
        });
    }

    showSavedIndicator() {
        // Create or show saved indicator
        let indicator = document.getElementById('savedIndicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'savedIndicator';
            indicator.className = 'saved-indicator';
            indicator.textContent = 'Datos guardados ✓';
            document.body.appendChild(indicator);
        }

        indicator.classList.add('show');

        setTimeout(() => {
            indicator.classList.remove('show');
        }, 3000);
    }

    clearData() {
        if (confirm('¿Estás seguro de que quieres borrar todos los datos?')) {
            localStorage.removeItem('jobsFrameworkData');
            location.reload();
        }
    }
}

// Utility functions
function addHierarchyRow() {
    const table = document.getElementById('hierarchyTable');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const newRow = tbody.insertRow();

    newRow.innerHTML = `
        <td><input type="text" placeholder="Nivel del job" style="width: 100%; border: none; padding: 8px;"></td>
        <td><input type="text" placeholder="Descripción del job" style="width: 100%; border: none; padding: 8px;"></td>
        <td><input type="text" placeholder="Descripción detallada" style="width: 100%; border: none; padding: 8px;"></td>
        <td><button type="button" onclick="removeHierarchyRow(this)" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Eliminar</button></td>
    `;
}

function removeHierarchyRow(button) {
    const row = button.closest('tr');
    row.remove();
}

// Initialize framework when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.jobsFramework = new JobsFramework();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            window.jobsFramework.saveData();
        }

        // Ctrl+P to export
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.jobsFramework.exportToPDF();
        }
    });
});

// Export functions for global access
window.addHierarchyRow = addHierarchyRow;
window.removeHierarchyRow = removeHierarchyRow;