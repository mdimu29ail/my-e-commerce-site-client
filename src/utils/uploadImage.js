export const uploadImageToImgBB = async imageFile => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey) {
    console.error('ImgBB API key missing in environment variables.');
    throw new Error('API Key Missing');
  }

  if (!imageFile) {
    throw new Error('No image file provided for upload.');
  }

  try {
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', imageFile); // Directly append the file object

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.display_url; // Direct secure URL
    } else {
      console.error('ImgBB API Error:', data);
      throw new Error(data.error?.message || 'Image upload failed');
    }
  } catch (error) {
    console.error('ImgBB Upload Exception:', error);
    throw error;
  }
};
