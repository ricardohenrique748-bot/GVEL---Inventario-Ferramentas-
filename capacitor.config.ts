import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gvel.inventarioferramentas',
  appName: 'Inventario Ferramentas - GV',
  webDir: 'dist',
  server: {
    url: 'http://localhost:3000',
    cleartext: true
  }
};

export default config;
