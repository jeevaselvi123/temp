/** @type {import('next').NextConfig} */

const dotenv = require('dotenv')

const nextConfig = {
  experimental: {
    appDir: true,
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
      preventFullImport: true,
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
      preventFullImport: true,
    },
    '@mui/system': {
      transform: '@mui/system/{{member}}',
      preventFullImport: true,
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
      preventFullImport: true,
    },
    '@mui/x-data-grid': {
      transform: '@mui/x-data-grid/{{member}}',
      skipDefaultConversion: true,
      preventFullImport: true,
    },
  },
  env: process.env.NODE_ENV === 'development' ? undefined : dotenv.config().parsed,
  async rewrites() {
    return [
      {
        source: '/organizations/:id/child',
        destination: '/organizations?id=:id',
      },
      {
        source: '/organizations/:id/child/:childOrganizationId',
        destination: '/organizations/:childOrganizationId',
      },
      {
        source: '/organizations/:id/child/:childOrganizationId/users',
        destination: '/organizations/:childOrganizationId/users',
      },
      {
        source: '/organizations/:id/child/:childOrganizationId/users/:profile',
        destination: '/organizations/:childOrganizationId/users/:profile',
      },
    ]
  },
}

module.exports = nextConfig
