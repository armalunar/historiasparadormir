export async function uploadCoverImage(file: File): Promise<string> {
  try {
    console.log('Iniciando conversão de imagem para base64:', file.name);
    
    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem');
    }

    // Converter arquivo para base64
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };
      reader.readAsDataURL(file);
    });

    console.log('Imagem convertida para base64 com sucesso');
    return base64String;
  } catch (error) {
    console.error('Erro ao converter imagem:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao converter imagem';
    throw new Error(message);
  }
}
