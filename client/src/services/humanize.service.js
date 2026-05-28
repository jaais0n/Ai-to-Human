import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

export async function humanizeText({
  text,
  mode,
  strength,
  creativity,
  complexity,
  tone,
}) {
  const response = await api.post('/humanize', {
    text,
    mode,
    strength,
    creativity,
    complexity,
    tone,
  });
  return response.data;
}

export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

export default api;
