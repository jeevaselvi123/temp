import { defineConfig } from 'cypress'
import { rmdir } from 'fs'
const { beforeRunHook } = require('cypress-mochawesome-reporter/lib')
const { verifyDownloadTasks } = require('cy-verify-downloads')

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    json: true,
    html: false,
    overwrite: false,
    reportPageTitle: 'AppAdmin',
    reportDir: 'cypress/reports',
    inlineAssets: true,
    toConsole: true,
    debug: true,
  },
  e2e: {
    baseUrl: 'http://localhost:3000/',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    defaultCommandTimeout: 20000,
    setupNodeEvents(on, config) {
      on('before:run', async (details) => {
        await beforeRunHook(details)
      })

      on('task', verifyDownloadTasks)

      on('task', {
        deleteFolder(folderName) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
                if (err) {
                  console.error(err)

                  return reject(err)
                }

                resolve(null)
              })
            }, 5000)
          })
        },
      })
    },
  },
})
