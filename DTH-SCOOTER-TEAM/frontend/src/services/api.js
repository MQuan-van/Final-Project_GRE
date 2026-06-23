import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 8000
});

export const getScooters = async () => {
  const response = await apiClient.get("/scooters");
  return response.data.data;
};

export const getScooterBySlug = async (slug) => {
  const response = await apiClient.get(`/scooters/${slug}`);
  return response.data.data;
};

export const getMilestones = async () => {
  const response = await apiClient.get("/milestones");
  return response.data.data;
};

export const getTeamStory = async () => {
  const response = await apiClient.get("/team-story");
  return response.data.data;
};