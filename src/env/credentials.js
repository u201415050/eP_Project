let credentials = {
  staging: {
    server: 'https://development.epaisa.com',
    clientId: 'VyBqmaWHtyrbRSMzmbgbOy2I',
    clientSecret: '0V7BpWR5r2Zy58ZRkHxeTKLn',
    sourceId: 8,
  },
  production: {
    server: 'https://halil.epaisa.com',
    clientId: '8fqCoX0RlPEFrd9EjacNmiKG',
    clientSecret: 'ai3FaHi18bOonCTkgZao71Ur',
    sourceId: 2,
  },
  uat: {
    server: 'https://nine.epaisa.com',
    clientId: 'I0TWr2VmzSuyDjLocEqUlnhk',
    clientSecret: 'QrYckeIBHL4NEHZo9iUSjtls',
    sourceId: 2,
  },
};

const current = credentials.production;
export const base_url = current.server;
export const clientId = current.clientId;
export default current;
