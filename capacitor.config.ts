import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kubashi.pollsy.io',
  appName: 'pollsy.io',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
