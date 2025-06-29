// Ready Player Me integration service
export class ReadyPlayerMeService {
  constructor() {
    this.baseUrl = 'https://api.readyplayer.me/v1';
    this.avatars = new Map();
  }

  // Generate a random avatar URL from Ready Player Me
  async generateRandomAvatar(gender = 'random') {
    const genders = gender === 'random' ? ['male', 'female'] : [gender];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    
    // Use Ready Player Me's random avatar endpoint
    const response = await fetch(`${this.baseUrl}/avatars/random?gender=${randomGender}`);
    
    if (!response.ok) {
      throw new Error('Failed to generate random avatar');
    }
    
    const data = await response.json();
    return data.avatarUrl;
  }

  // Create a custom avatar with specific parameters
  async createCustomAvatar(config = {}) {
    const defaultConfig = {
      gender: 'male',
      bodyType: 'full-body',
      style: 'realistic',
      // Add more customization options
      ...config
    };

    // This would typically involve their avatar creation API
    // For now, we'll return a placeholder
    return `https://models.readyplayer.me/${defaultConfig.gender}-${defaultConfig.style}.glb`;
  }

  // Load avatar GLB file
  async loadAvatar(avatarUrl) {
    if (this.avatars.has(avatarUrl)) {
      return this.avatars.get(avatarUrl);
    }

    try {
      const response = await fetch(avatarUrl);
      if (!response.ok) {
        throw new Error('Failed to load avatar');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      this.avatars.set(avatarUrl, objectUrl);
      return objectUrl;
    } catch (error) {
      console.error('Error loading avatar:', error);
      return null;
    }
  }

  // Get avatar metadata
  async getAvatarMetadata(avatarUrl) {
    try {
      const response = await fetch(`${this.baseUrl}/avatars/metadata?url=${encodeURIComponent(avatarUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to get avatar metadata');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting avatar metadata:', error);
      return null;
    }
  }

  // Clean up resources
  cleanup() {
    this.avatars.forEach(url => {
      URL.revokeObjectURL(url);
    });
    this.avatars.clear();
  }
}

// Export a singleton instance
export const readyPlayerMeService = new ReadyPlayerMeService(); 