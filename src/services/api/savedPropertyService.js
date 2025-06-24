import savedPropertyData from '@/services/mockData/savedProperties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let savedProperties = [...savedPropertyData];

const savedPropertyService = {
  async getAll() {
    await delay(200);
    return [...savedProperties];
  },

  async getById(id) {
    await delay(150);
    const savedProperty = savedProperties.find(sp => sp.Id === parseInt(id, 10));
    if (!savedProperty) {
      throw new Error('Saved property not found');
    }
    return { ...savedProperty };
  },

  async create(savedProperty) {
    await delay(300);
    const newId = savedProperties.length > 0 ? Math.max(...savedProperties.map(sp => sp.Id)) + 1 : 1;
    const newSavedProperty = {
      Id: newId,
      ...savedProperty,
      savedDate: new Date().toISOString()
    };
    savedProperties.push(newSavedProperty);
    return { ...newSavedProperty };
  },

  async update(id, data) {
    await delay(250);
    const index = savedProperties.findIndex(sp => sp.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const { Id, ...updateData } = data;
    savedProperties[index] = { ...savedProperties[index], ...updateData };
    return { ...savedProperties[index] };
  },

  async delete(id) {
    await delay(200);
    const index = savedProperties.findIndex(sp => sp.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    savedProperties.splice(index, 1);
    return true;
  },

  async isPropertySaved(propertyId) {
    await delay(100);
    return savedProperties.some(sp => sp.propertyId === propertyId.toString());
  }
};

export default savedPropertyService;