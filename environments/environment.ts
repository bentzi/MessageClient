export const environment = {
    production: false,
    secretKeys: {
        '1234': '1234SecretKey',
        '5678': '5678SecretKey'
    } as { [key: string]: string },
  apiUrl: 'https://localhost:7061/api'
};