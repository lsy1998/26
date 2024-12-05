export const saveCanvasData = (data) => {
  const jsonString = JSON.stringify(data);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `canvas-data-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadCanvasData = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.version) {
          reject(new Error('Invalid file format'));
          return;
        }
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const initializeCanvas = async () => {
  try {
    const response = await fetch('/initial-canvas.json');
    if (!response.ok) {
      throw new Error('No initial canvas data found');
    }
    const data = await response.json();
    if (!data.version) {
      throw new Error('Invalid canvas data format');
    }
    return data;
  } catch (error) {
    console.error('Error loading initial canvas data:', error);
    return null;
  }
}; 