// client/src/services/collectionService.js
import { API_ENDPOINTS, apiRequest, logInfo, logError, logWarn } from '../utils';

export const collectionService = {
  // Tüm koleksiyonları getir
  async getAll(params = {}) {
    try {
      const response = await apiRequest('get', API_ENDPOINTS.COLLECTIONS, null, params);
      return response.data;
    } catch (error) {
      logError('Koleksiyonlar getirilirken hata oluştu', error, 'collectionService');
      throw error;
    }
  },

  // Belirli bir koleksiyonu slug ile getir
  async getBySlug(slug) {
    try {
      const response = await apiRequest('get', `${API_ENDPOINTS.COLLECTIONS}/${slug}`);
      return response.data;
    } catch (error) {
      // Sessizce 404 hatalarını ele al
      if (error.response?.status === 404) {
        logError(`Koleksiyon bulunamadı: ${slug}`, null, 'collectionService');
        throw error; // Sadece yeniden fırlat, ek hata mesajı yazdırma
      }
      logError(`${slug} koleksiyonu getirilirken hata oluştu`, error, 'collectionService');
      throw error;
    }
  },

  // Özel koleksiyonları getir
  async getSpecialCollections(limit = 3) {
    try {
      const response = await apiRequest('get', `${API_ENDPOINTS.COLLECTIONS}/special`, null, { limit });
      return response.data;
    } catch (error) {
      logError('Özel koleksiyonlar getirilirken hata oluştu', error, 'collectionService');
      throw error;
    }
  },

  // Koleksiyona ait ürünleri getir
  async getCollectionProducts(slug, params = {}) {
    try {
      // API isteğinden önce parametreleri kontrol et ve hazırla
      const apiParams = { ...params };
      
      // Sayfa ve limit için varsayılan değerler
      if (!apiParams.page) apiParams.page = 1;
      if (!apiParams.limit) apiParams.limit = 9;
      
      logInfo(`${slug} koleksiyonu için ürünler isteniyor`, apiParams, 'collectionService');
      
      // Fiyat filtreleri varsa string'den sayıya dönüşümü kontrol et
      if (apiParams.minPrice !== undefined && apiParams.minPrice !== '') {
        if (typeof apiParams.minPrice === 'string') {
          apiParams.minPrice = parseFloat(apiParams.minPrice);
        }
        // NaN değer kontrolü
        if (isNaN(apiParams.minPrice)) {
          delete apiParams.minPrice;
        }
      }
      
      if (apiParams.maxPrice !== undefined && apiParams.maxPrice !== '') {
        if (typeof apiParams.maxPrice === 'string') {
          apiParams.maxPrice = parseFloat(apiParams.maxPrice);
        }
        // NaN değer kontrolü
        if (isNaN(apiParams.maxPrice)) {
          delete apiParams.maxPrice;
        }
      }
      
      // Sıralama parametresi doğru formatta gönderildiğinden emin ol
      if (apiParams.sort) {
        // Backend'e uygun sıralama formatını kontrol et
        const sortMapping = {
          'newest': '-createdAt',
          'price_asc': 'price',
          'price_desc': '-price',
          'name_asc': 'name',
          'name_desc': '-name',
          'rating_desc': '-rating'
        };
        
        // Ön taraf sıralama değerini arka taraf formatına dönüştür
        if (sortMapping[apiParams.sort]) {
          apiParams.sort = sortMapping[apiParams.sort];
        }
        
        logInfo("Sıralama parametresi API'ye gönderiliyor", apiParams.sort, 'collectionService');
      }
      
      // API isteğini yap ve parametreleri ekle
      logInfo("API'ye gönderilen son parametreler", apiParams, 'collectionService');
      const response = await apiRequest('get', `${API_ENDPOINTS.COLLECTIONS}/${slug}/products`, null, apiParams);
      
      logInfo(`${slug} koleksiyonu için ürünler yanıtı`, response, 'collectionService');
      
      // API yanıt yapısını detaylı olarak incele
      const data = response;
      
      // Ürünlerin doğrudan API yanıtından alınması
      let result = {
        products: [],
        total: 0
      };
      
      if (data && data.success === true) {
        // API standart başarılı yanıt formatında
        if (data.data && Array.isArray(data.data)) {
          result.products = data.data;
          result.total = data.total || data.count || data.data.length;
        } else if (Array.isArray(data.products)) {
          result.products = data.products;
          result.total = data.total || data.count || data.products.length;
        }
      } else if (Array.isArray(data)) {
        // API doğrudan dizi döndürüyor
        result.products = data;
        result.total = data.length;
      } else if (data && typeof data === 'object') {
        // Diğer muhtemel veri yapıları
        if (Array.isArray(data.data)) {
          result.products = data.data;
          result.total = data.total || data.count || data.data.length;
        }
      }
      
      // Debug için API yanıt yapısı
      logInfo(`Dönüştürülmüş yanıt`, result, 'collectionService');
      
      // Client tarafında fiyat filtreleme kontrolü
      if ((apiParams.minPrice !== undefined || apiParams.maxPrice !== undefined) && result.products.length > 0) {
        const minPrice = apiParams.minPrice !== undefined ? Number(apiParams.minPrice) : 0;
        const maxPrice = apiParams.maxPrice !== undefined ? Number(apiParams.maxPrice) : Infinity;
        
        logInfo(`Client tarafında fiyat filtresi uygulanıyor`, { min: minPrice, max: maxPrice }, 'collectionService');
        
        // Fiyat aralığı dışındaki ürünleri filtrele
        const filteredProducts = result.products.filter(product => {
          const price = Number(product.price);
          const inRange = price >= minPrice && price <= maxPrice;
          if (!inRange) {
            logInfo(`Ürün fiyat aralığı dışında, filtreleniyor`, { name: product.name, price }, 'collectionService');
          }
          return inRange;
        });
        
        // Filtreleme sonuçlarını güncelle
        if (filteredProducts.length !== result.products.length) {
          logInfo(`Fiyat filtresi sonucu`, {
            before: result.products.length,
            after: filteredProducts.length
          }, 'collectionService');
          
          result.products = filteredProducts;
          result.total = filteredProducts.length;
        }
      }
      
      // Client tarafında sıralama problemi için istemci tarafında da sıralama yapalım
      if (apiParams.sort && result.products.length > 1) {
        const originalSort = apiParams.sort; // API'ye gönderilen sort parametresi
        const clientSort = params.sort; // Frontend'den gelen orijinal sort parametresi
        
        logInfo(`Client tarafında sıralama kontrolü yapılıyor`, { 
          frontendSort: clientSort, 
          backendSort: originalSort 
        }, 'collectionService');
        
        switch (clientSort) {
          case 'price_desc':
            // Fiyat azalan sıralama
            result.products.sort((a, b) => Number(b.price) - Number(a.price));
            logInfo("Fiyata göre azalan sıralama yapıldı (client tarafında)", null, 'collectionService');
            break;
          case 'price_asc':
            // Fiyat artan sıralama
            result.products.sort((a, b) => Number(a.price) - Number(b.price));
            logInfo("Fiyata göre artan sıralama yapıldı (client tarafında)", null, 'collectionService');
            break;
          case 'name_asc':
            // İsim A-Z sıralama
            result.products.sort((a, b) => {
              if (!a.name) return 1;
              if (!b.name) return -1;
              return String(a.name).localeCompare(String(b.name), 'tr');
            });
            logInfo("İsim A-Z sıralama yapıldı (client tarafında)", null, 'collectionService');
            break;
          case 'name_desc':
            // İsim Z-A sıralama
            result.products.sort((a, b) => {
              if (!a.name) return 1;
              if (!b.name) return -1;
              return String(b.name).localeCompare(String(a.name), 'tr');
            });
            logInfo("İsim Z-A sıralama yapıldı (client tarafında)", null, 'collectionService');
            break;
          case 'newest':
            // En yeniler sıralama
            result.products.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB - dateA;
            });
            logInfo("En yeniler sıralama yapıldı (client tarafında)", null, 'collectionService');
            break;
          case 'rating_desc':
            // Puan azalan sıralama
            result.products.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
            logInfo("Puana göre azalan sıralama yapıldı (client tarafında)", null, 'collectionService');
            break;
        }
        
        // Sıralanmış ürünlerin ilk ikisini göster
        if (result.products.length >= 2) {
          logInfo(`Client sıralama sonrası ilk iki ürün`, 
            result.products.slice(0, 2).map(p => ({
              id: p._id, 
              name: p.name, 
              price: p.price,
              createdAt: p.createdAt
            })), 'collectionService'
          );
        }
      }
      
      // Backend'in ürünleri sıraladığını doğrula
      if (params.sort && result.products.length > 1) {
        logInfo(`Sıralama kontrolü (${params.sort})`, 
          result.products.slice(0, 2).map(p => ({
            id: p._id, 
            name: p.name, 
            price: p.price,
            createdAt: p.createdAt
          })), 'collectionService'
        );
      }
      
      return result;
    } catch (error) {
      logError(`${slug} koleksiyonuna ait ürünler getirilirken hata oluştu`, error, 'collectionService');
      throw error;
    }
  },

  // Admin fonksiyonları

  // Yeni koleksiyon oluştur
  async create(collectionData) {
    try {
      const response = await apiRequest('post', API_ENDPOINTS.COLLECTIONS, collectionData);
      return response;
    } catch (error) {
      logError('Koleksiyon oluşturulurken hata oluştu', error, 'collectionService');
      throw error;
    }
  },

  // Koleksiyon güncelle
  async update(slug, collectionData) {
    try {
      const response = await apiRequest('put', `${API_ENDPOINTS.COLLECTIONS}/${slug}`, collectionData);
      return response;
    } catch (error) {
      logError(`${slug} koleksiyonu güncellenirken hata oluştu`, error, 'collectionService');
      throw error;
    }
  },

  // Koleksiyon sil
  async delete(slug) {
    try {
      const response = await apiRequest('delete', `${API_ENDPOINTS.COLLECTIONS}/${slug}`);
      return response;
    } catch (error) {
      logError(`${slug} koleksiyonu silinirken hata oluştu`, error, 'collectionService');
      throw error;
    }
  }
};