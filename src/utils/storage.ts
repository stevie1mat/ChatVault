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
    
    console.log('📦 Storing chat data:', dataSize, 'bytes, Messages:', messageCount);
    console.log('Using IndexedDB for storage');
    
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
          console.log('✅ Stored in IndexedDB successfully');
          resolve();
        };
        request.onerror = () => {
          console.error('❌ IndexedDB storage error:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ IndexedDB storage failed:', error);
      throw error;
    }
  }

  async getChatData(): Promise<any | null> {
    try {
      console.log('🔍 Retrieving from IndexedDB...');
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('current');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          if (request.result) {
            console.log('✅ Retrieved from IndexedDB successfully');
            console.log('📊 IndexedDB data - Messages:', request.result.data?.messages?.length || 0);
            resolve(request.result.data);
          } else {
            console.log('❌ No data found in IndexedDB');
            resolve(null);
          }
        };
        request.onerror = () => {
          console.error('❌ IndexedDB retrieval error:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('❌ IndexedDB retrieval failed:', error);
      return null;
    }
  }

  async clearChatData(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete('current');
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log('Cleared IndexedDB data successfully');
          resolve();
        };
        request.onerror = () => {
          console.error('IndexedDB clear error:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('IndexedDB clear failed:', error);
      throw error;
    }
  }
}

export const chatStorage = new ChatStorage(); 