// Utilitaire de validation d'image robuste
// QR Badge App - CREDIT: KIRITO

/**
 * Vérifie si une image est valide et disponible
 * @param {string} imagePath - Chemin de l'image à vérifier
 * @returns {Promise<boolean>} - true si l'image est valide, false sinon
 */
export const isImageValid = async (imagePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};

/**
 * Obtient une image de fallback en cas d'erreur
 * @param {string} text - Texte à afficher dans l'image de fallback
 * @param {string} bgColor - Couleur de fond (format hex)
 * @param {string} textColor - Couleur du texte (format hex)
 * @returns {string} - URL de l'image SVG de fallback
 */
export const getFallbackImage = (text = 'MITUKI', bgColor = '#003366', textColor = '#FFFFFF') => {
  // Création d'une image SVG avec le texte fourni
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="${textColor}" 
        text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  
  // Conversion en base64 pour utilisation comme URL d'image
  const encoded = btoa(svgContent);
  return `data:image/svg+xml;base64,${encoded}`;
};

/**
 * Charge une image avec fallback automatique
 * @param {string} primarySrc - Source principale de l'image
 * @param {string} fallbackText - Texte à utiliser en cas d'échec
 * @param {Function} setImageSrc - Fonction pour définir la source de l'image
 */
export const loadImageWithFallback = async (primarySrc, fallbackText, setImageSrc) => {
  try {
    const isValid = await isImageValid(primarySrc);
    if (isValid) {
      setImageSrc(primarySrc);
    } else {
      console.warn(`Image non disponible: ${primarySrc}, utilisation du fallback`);
      setImageSrc(getFallbackImage(fallbackText));
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'image:', error);
    setImageSrc(getFallbackImage(fallbackText));
  }
};

/**
 * Optimise une image pour le web
 * @param {File} imageFile - Fichier image à optimiser
 * @param {number} maxWidth - Largeur maximale
 * @param {number} maxHeight - Hauteur maximale
 * @param {number} quality - Qualité de l'image (0-1)
 * @returns {Promise<Blob>} - Image optimisée
 */
export const optimizeImage = (imageFile, maxWidth = 512, maxHeight = 512, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calcul des dimensions optimisées
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
        
        // Création du canvas pour redimensionner
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Dessin de l'image redimensionnée
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Conversion en blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, imageFile.type, quality);
      };
      
      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image pour optimisation'));
      };
      
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier image'));
    };
    
    reader.readAsDataURL(imageFile);
  });
};
