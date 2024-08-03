import { db } from './firebaseConfig';

document.addEventListener('DOMContentLoaded', () => {
    const vehicleForm = document.getElementById('vehicleForm');
    const plateInput = document.getElementById('plate');
    const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];
    const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
    const historyContent = document.getElementById('historyContent');

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const loadHistory = () => {
        db.collection('vehicles').orderBy('datetime', 'desc').get().then(snapshot => {
            snapshot.forEach(doc => {
                addRecordToTable(doc.data());
            });
        }).catch(error => console.error('Error loading history:', error));
    };

    const addRecordToTable = (record) => {
        const newRow = historyTable.insertRow(0);
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

        db.collection('vehicles').add(record).then(() => {
            addRecordToTable(record);
            vehicleForm.reset();
        }).catch(error => console.error('Error adding vehicle:', error));
    };

    const handlePlateInput = () => {
        // Esta función puede ser ajustada si decides implementar búsqueda por placa
    };

    const toggleHistoryVisibility = () => {
        if (historyContent.style.display === 'none') {
            historyContent.style.display = 'block';
            toggleHistoryBtn.textContent = 'Ocultar Historial';
        } else {
            historyContent.style.display = 'none';
            toggleHistoryBtn.textContent = 'Mostrar Historial';
        }
    };

    const openFullscreen = (img) => {
        const fullscreenImg = document.createElement('img');
        fullscreenImg.src = img.src;
        fullscreenImg.classList.add('fullscreen-img');
        fullscreenImg.addEventListener('click', () => {
            document.body.removeChild(fullscreenImg);
        });
        document.body.appendChild(fullscreenImg);
    };

    vehicleForm.addEventListener('submit', handleFormSubmit);
    plateInput.addEventListener('input', handlePlateInput);
    toggleHistoryBtn.addEventListener('click', toggleHistoryVisibility);

    loadHistory();
});
