// Quản lý ảnh cho các scooter
// Cấu trúc: thêm ảnh vào đây và sử dụng trong các component

export const scooterImages = {
  // Scooter 1
  scooter1: {
    thumbnail: '/images/v1.jpeg',
    secondary1: '/images/v1_2.jpeg',
    secondary2: '/images/v1_3.jpeg',
  },

  // Scooter 2
  scooter2: {
    thumbnail: '/images/v2.jpeg',
    secondary1: '/images/v2_2.jpeg',
    secondary2: '/images/v2_3.jpeg',
  },

  // Scooter 3
  scooter3: {
    thumbnail: '/images/v3.jpeg',
    secondary1: '/images/v3_2.jpeg',
    secondary2: '/images/v3_3.jpeg',
  },

  // Thêm scooter khác tại đây
  // scooter4: { ... }
};

// Fallback images khi không có ảnh
export const fallbackImage = '/images/placeholder.png';

// Helper function để lấy ảnh theo scooter ID
export const getScooterImages = (scooterVersion) => {
  if (!scooterVersion) return scooterImages.scooter1;
  
  const key = scooterVersion.toLowerCase().replace(/\s+/g, '');
  const found = Object.keys(scooterImages).find(k => k.includes(key)) || 'scooter1';
  return scooterImages[found] || scooterImages.scooter1;
};
