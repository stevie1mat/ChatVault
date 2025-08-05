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
    const dataSize = JSON.stringify(data).length;
    const messageCount = data.messages?.length || 0;
    
    console.log('Data size:', dataSize, 'bytes, Messages:', messageCount);
    
    // Force IndexedDB for large files or files with many messages
    if (dataSize > 4 * 1024 * 1024 || messageCount > 1000) {
      console.log('Using IndexedDB for large file storage');
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
            console.log('Stored in IndexedDB successfully');
            resolve();
          };
          request.onerror = () => {
            console.error('IndexedDB storage error:', request.error);
            reject(request.error);
          };
        });
      } catch (error) {
        console.error('IndexedDB storage failed:', error);
        throw error;
      }
    }
    
    // Use localStorage for small files
    try {
      console.log('Using localStorage for small file storage');
      localStorage.setItem('chatData', JSON.stringify(data));
      console.log('Stored in localStorage:', dataSize, 'bytes');
    } catch (error) {
      console.log('localStorage failed, trying IndexedDB...');
      // Fallback to IndexedDB if localStorage fails
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
            console.log('Fallback: Stored in IndexedDB successfully');
            resolve();
          };
          request.onerror = () => {
            console.error('Fallback: IndexedDB storage error:', request.error);
            reject(request.error);
          };
        });
      } catch (indexedDBError) {
        console.error('Both localStorage and IndexedDB failed:', indexedDBError);
        throw indexedDBError;
      }
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
      console.log('Trying to retrieve from IndexedDB...');
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('current');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          if (request.result) {
            console.log('Retrieved from IndexedDB successfully');
            console.log('IndexedDB data:', request.result);
            resolve(request.result.data);
          } else {
            console.log('No data found in IndexedDB');
            resolve(null);
          }
        };
        request.onerror = () => {
          console.error('IndexedDB retrieval error:', request.error);
          reject(request.error);
        };
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