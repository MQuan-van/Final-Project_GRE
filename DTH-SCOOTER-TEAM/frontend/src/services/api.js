import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 8000
});

const fallbackScooters = [
  {
    _id: "nvx-155-vva",
    name: "DTH SCOOTER TEAM",
    version: "NVX 155 VVA V1",
    thumbnail: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=85",
    images: [
      {
        _id: "nvx-front",
        title: "NVX front profile",
        imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=85"
      },
      {
        _id: "nvx-street",
        title: "Street ride setup",
        imageUrl: "https://images.unsplash.com/photo-1558981001-792f6c0d5068?auto=format&fit=crop&w=1400&q=85"
      },
      {
        _id: "nvx-night",
        title: "Night garage mood",
        imageUrl: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1400&q=85"
      }
    ]
  },
  {
    _id: "nvx-monster-energy",
    name: "DTH SCOOTER TEAM",
    version: "NVX 155 VVA V2",
    description: "Một layout showcase cho các bản NVX tem đấu, dàn áo nổi bật và gallery ảnh theo phong cách đen, sâu, giàu tương phản.",
    thumbnail: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1400&q=85",
    images: [
      {
        _id: "monster-side",
        title: "Monster side view",
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1400&q=85"
      },
      {
        _id: "monster-detail",
        title: "Detail kit",
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1400&q=85"
      }
    ]
  },
  {
    _id: "nvx-custom",
    name: "DTH SCOOTER TEAM",
    version: "NVX 155 VVA V3",
    description: "Không gian để trưng bày các bản độ mâm, phuộc, pô, dàn áo và những nâng cấp thẩm mỹ của thành viên trong team.",
    thumbnail: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=1400&q=85",
    images: [
      {
        _id: "custom-garage",
        title: "Custom garage",
        imageUrl: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=1400&q=85"
      },
      {
        _id: "custom-road",
        title: "Road setup",
        imageUrl: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1400&q=85"
      }
    ]
  }
];

export const getScooters = async () => {
  try {
    const response = await apiClient.get("/scooters");
    return response.data.data;
  } catch (error) {
    console.warn("Using fallback scooters because API is unavailable:", error.message);
    return fallbackScooters;
  }
};

export const getScooterById = async (id) => {
  try {
    const response = await apiClient.get(`/scooters/${id}`);
    return response.data.data;
  } catch (error) {
    console.warn("Using fallback scooter detail because API is unavailable:", error.message);
    return fallbackScooters.find((scooter) => scooter._id === id) || fallbackScooters[0];
  }
};
