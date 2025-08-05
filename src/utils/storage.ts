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
    
    // Check if data is too large (IndexedDB has limits)
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    if (dataSize > maxSize) {
      console.warn('⚠️ Large file detected, attempting to store in chunks...');
      
      // Store in chunks if too large
      return this.storeLargeData(data);
    }
    
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

  private async storeLargeData(data: any): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Split messages into chunks
      const messages = data.messages || [];
      const chunkSize = 1000; // 1000 messages per chunk
      const chunks: any[][] = [];
      
      for (let i = 0; i < messages.length; i += chunkSize) {
        chunks.push(messages.slice(i, i + chunkSize));
      }
      
      console.log(`📦 Splitting ${messages.length} messages into ${chunks.length} chunks`);
      
      // Store metadata first
      const metadata = {
        ...data,
        messages: undefined, // Remove messages from metadata
        messageChunks: chunks.length,
        totalMessages: messages.length
      };
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put({
          id: 'current',
          data: metadata,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      // Store each chunk
      for (let i = 0; i < chunks.length; i++) {
        await new Promise<void>((resolve, reject) => {
          const request = store.put({
            id: `chunk_${i}`,
            data: chunks[i],
            timestamp: Date.now()
          });
          
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
        
        console.log(`✅ Stored chunk ${i + 1}/${chunks.length}`);
      }
      
      console.log('✅ Large data stored successfully in chunks');
    } catch (error) {
      console.error('❌ Large data storage failed:', error);
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
      
      return new Promise<any | null>((resolve, reject) => {
        request.onsuccess = async () => {
          if (request.result) {
            console.log('✅ Retrieved from IndexedDB successfully');
            
            // Check if data is chunked
            if (request.result.data.messageChunks) {
              console.log('📦 Detected chunked data, reassembling...');
              const reassembledData = await this.reassembleChunkedData(db, request.result.data);
              console.log('📊 Reassembled data - Messages:', reassembledData.messages?.length || 0);
              resolve(reassembledData);
            } else {
              console.log('📊 IndexedDB data - Messages:', request.result.data?.messages?.length || 0);
              resolve(request.result.data);
            }
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

  private async reassembleChunkedData(db: IDBDatabase, metadata: any): Promise<any> {
    try {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const allMessages: any[] = [];
      
      // Retrieve all chunks
      for (let i = 0; i < metadata.messageChunks; i++) {
        const chunkRequest = store.get(`chunk_${i}`);
        
        await new Promise<void>((resolve, reject) => {
          chunkRequest.onsuccess = () => {
            if (chunkRequest.result) {
              allMessages.push(...chunkRequest.result.data);
            }
            resolve();
          };
          chunkRequest.onerror = () => reject(chunkRequest.error);
        });
        
        console.log(`✅ Retrieved chunk ${i + 1}/${metadata.messageChunks}`);
      }
      
      // Reassemble the data
      return {
        ...metadata,
        messages: allMessages,
        messageChunks: undefined // Remove chunk info
      };
    } catch (error) {
      console.error('❌ Failed to reassemble chunked data:', error);
      throw error;
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