// Storage management module
export class StorageManager {
    constructor(storageKey = 'kalandlap_data') {
        this.storageKey = storageKey;
    }

    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('Data saved to localStorage');
            return true;
        } catch (e) {
            console.error('Failed to save data:', e);
            return false;
        }
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                console.log('Data loaded from localStorage');
                return JSON.parse(saved);
            }
            return null;
        } catch (e) {
            console.error('Failed to load data:', e);
            return null;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (e) {
            console.error('Failed to clear data:', e);
            return false;
        }
    }

    exportToFile(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    importFromFile(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}