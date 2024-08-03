document.addEventListener('DOMContentLoaded', () => {
    // Elementos del formulario
    const vehicleForm = document.getElementById('vehicleForm');
    const plateInput = document.getElementById('plate');
    
    // Elementos del historial
    const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
    const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
    const historyContent = document.getElementById('historyContent');

    // Convertir imagen a base64
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // Cargar registros desde localStorage
    const loadHistory = () => {
        const records = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
        records.forEach(record => addRecordToTable(record));
    };

    // Guardar registro en localStorage
    const saveRecord = (record) => {
        const records = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
        records.push(record);
        localStorage.setItem('vehicleRecords', JSON.stringify(records));
    };

    // Añadir registro a la tabla
    const addRecordToTable = (record) => {
        const newRow = historyTable.insertRow();
        
        newRow.insertCell().textContent = record.datetime;
        newRow.insertCell().textContent = record.brand;
        newRow.insertCell().textContent = record.model;
        newRow.insertCell().textContent = record.plate;
        newRow.insertCell().textContent = record.color;
        newRow.insertCell().textContent = record.owner;
        newRow.insertCell().textContent = record.garage;
        newRow.insertCell().textContent = record.observations;
        
        const imageCell = newRow.insertCell();
        record.images.forEach(image => {
            const img = document.createElement('img');
            img.src = image;
            img.width = 100;
            img.addEventListener('click', () => openFullscreen(img));
            imageCell.appendChild(img);
        });
    };

    // Manejar envío del formulario
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(vehicleForm);
        const images = await Promise.all(Array.from(formData.getAll('image')).slice(0, 4).map(file => toBase64(file)));
        const record = {
            datetime: formData.get('datetime'),
            brand: formData.get('brand'),
            model: formData.get('model'),
            plate: formData.get('plate'),
            color: formData.get('color'),
            owner: formData.get('owner'),
            garage: formData.get('garage'),
            observations: formData.get('observations'),
            images: images
        };

        saveRecord(record);
        addRecordToTable(record);
        vehicleForm.reset();
    };

    // Manejar autocompletado de placa
    const handlePlateInput = () => {
        const records = JSON.parse(localStorage.getItem('vehicleRecords')) || [];
        const record = records.find(record => record.plate === plateInput.value);
        
        if (record) {
            document.getElementById('datetime').value = record.datetime;
            document.getElementById('brand').value = record.brand;
            document.getElementById('model').value = record.model;
            document.getElementById('color').value = record.color;
            document.getElementById('owner').value = record.owner;
            document.getElementById('garage').value = record.garage;
            document.getElementById('observations').value = record.observations;
        }
    };

    // Alternar visibilidad del historial
    const toggleHistoryVisibility = () => {
        if (historyContent.style.display === 'none') {
            historyContent.style.display = 'block';
            toggleHistoryBtn.textContent = 'Ocultar Historial';
        } else {
            historyContent.style.display = 'none';
            toggleHistoryBtn.textContent = 'Mostrar Historial';
        }
    };

    // Mostrar imagen en pantalla completa
    const openFullscreen = (img) => {
        const fullscreenImg = document.createElement('img');
        fullscreenImg.src = img.src;
        fullscreenImg.classList.add('fullscreen-img');
        fullscreenImg.addEventListener('click', () => {
            document.body.removeChild(fullscreenImg);
        });
        document.body.appendChild(fullscreenImg);
    };

    // Event listeners
    vehicleForm.addEventListener('submit', handleFormSubmit);
    plateInput.addEventListener('input', handlePlateInput);
    toggleHistoryBtn.addEventListener('click', toggleHistoryVisibility);

    // Cargar historial al iniciar
    loadHistory();
});
