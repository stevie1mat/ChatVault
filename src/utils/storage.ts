// Storage utility for handling large chat files
export class ChatStorage {
  private dbName = 'ChatVaultDB';
  private storeName = 'chatData';
  private version = 1;

  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async storeChatData(data: any): Promise<void> {
    try {
      // First try localStorage for small files
      const localStorageSize = JSON.stringify(data).length;
      if (localStorageSize < 4 * 1024 * 1024) { // 4MB limit for localStorage
        localStorage.setItem('chatData', JSON.stringify(data));
        console.log('Stored in localStorage:', localStorageSize, 'bytes');
        return;
      }
    } catch (error) {
      console.log('localStorage failed, trying IndexedDB...');
    }

    // Use IndexedDB for large files
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.put({
        id: 'current',
        data: data,
        timestamp: Date.now()
      });
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log('Stored in IndexedDB');
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB storage failed:', error);
      throw error;
    }
  }

  async getChatData(): Promise<any | null> {
    try {
      // First try localStorage
      const localStorageData = localStorage.getItem('chatData');
      if (localStorageData) {
        console.log('Retrieved from localStorage');
        return JSON.parse(localStorageData);
      }
    } catch (error) {
      console.log('localStorage retrieval failed, trying IndexedDB...');
    }

    // Try IndexedDB
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('current');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          if (request.result) {
            console.log('Retrieved from IndexedDB');
            resolve(request.result.data);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB retrieval failed:', error);
      return null;
    }
  }

  async clearChatData(): Promise<void> {
    try {
      localStorage.removeItem('chatData');
    } catch (error) {
      console.log('localStorage clear failed');
    }

    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete('current');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('IndexedDB clear failed:', error);
    }
  }
}

export const chatStorage = new ChatStorage(); 