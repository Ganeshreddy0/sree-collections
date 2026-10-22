import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sreecollections',
  JWT_SECRET: process.env.JWT_SECRET || 'sreecollections_jwt_secret_default_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:3001'],
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Meta WhatsApp Cloud API Configuration
  WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION || 'v20.0',
  WHATSAPP_TEMPLATE_NAME: process.env.WHATSAPP_TEMPLATE_NAME || 'sree_order_confirmation',
  WHATSAPP_TEMPLATE_LANG: process.env.WHATSAPP_TEMPLATE_LANG || 'en',
  WHATSAPP_STATUS_TEMPLATE_NAME: process.env.WHATSAPP_STATUS_TEMPLATE_NAME || 'sree_order_status_update',
  WHATSAPP_ENABLE_FALLBACK_TEXT: process.env.WHATSAPP_ENABLE_FALLBACK_TEXT !== 'false',
  OWNER_WHATSAPP_PHONE: process.env.OWNER_WHATSAPP_PHONE || '919948469132',
};
