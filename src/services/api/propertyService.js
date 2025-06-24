import propertyData from '@/services/mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let properties = [...propertyData];

const propertyService = {
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredProperties = [...properties];

    // Apply filters
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax);
    }
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filteredProperties = filteredProperties.filter(p => filters.propertyTypes.includes(p.propertyType));
    }
    if (filters.bedroomsMin) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.squareFeetMin) {
      filteredProperties = filteredProperties.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.amenities.some(amenity => p.amenities.includes(amenity))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filteredProperties.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProperties.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filteredProperties.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
          break;
        case 'oldest':
          filteredProperties.sort((a, b) => new Date(a.listingDate) - new Date(b.listingDate));
          break;
        case 'size-large':
          filteredProperties.sort((a, b) => b.squareFeet - a.squareFeet);
          break;
        case 'size-small':
          filteredProperties.sort((a, b) => a.squareFeet - b.squareFeet);
          break;
        default:
          break;
      }
    }

    return filteredProperties;
  },

  async getById(id) {
    await delay(250);
    const property = properties.find(p => p.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async search(query) {
    await delay(200);
    if (!query) return [];
    
    const searchTerm = query.toLowerCase();
    return properties.filter(property => 
      property.title.toLowerCase().includes(searchTerm) ||
      property.address.street.toLowerCase().includes(searchTerm) ||
      property.address.city.toLowerCase().includes(searchTerm) ||
      property.address.state.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm)
    );
  }
};

export default propertyService;