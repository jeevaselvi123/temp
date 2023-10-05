const fs = require('fs')
const path = require('path')

const specFilePath = path.join('cypress', 'e2e', 'tests')
const pipelineDir = 'pipelines'

let jobs = `
include: pipelines/yarn-cypress-template.yml

stages:
  - integration tests
  - email cypress report

`

const formatJobName = (name) => {
  return name.split('.')[0].replaceAll('-', '_')
}

const integrationTestJob = (name) => `
integration_test_template_${formatJobName(name)}:
  stage: integration tests
  extends: 
    - .cypress_template
    - .yarn_cache_template
  rules:
    - if: $CI_PIPELINE_SOURCE == "parent_pipeline"
      when: on_success
  script:
    - export ENV_FILE=\${!ENV_FILE}
    - cat "$ENV_FILE" > ".env"
    - yarn cypress:run --spec cypress/e2e/tests/${name} --browser chrome --config baseUrl="https://$APP_URL" --reporter-options reportFilename=${formatJobName(name)}
  allow_failure: true
  artifacts:
    expire_in: 3 days
    paths:
      - $CI_PROJECT_DIR/cypress/reports/.jsons
      - $CI_PROJECT_DIR/cypress-mochawesome-reporter.log
      - $CI_PROJECT_DIR/cypress/videos
      - $CI_PROJECT_DIR/cypress/screenshots
      - $CI_PROJECT_DIR/cypress/integration/pages/personas/__image_snapshots__
    when: always

`

const emailCypressReportJob = (neededJobs) => `
email_cypress_report:
  stage: email cypress report
  extends: 
    - .cypress_template
    - .yarn_cache_template
  needs:
${neededJobs}  rules:
    - if: $CI_PIPELINE_SOURCE == "parent_pipeline" && $SEND_REPORT_MAIL == "true"
      when: on_success
  before_script:
    - yarn mochawesome-merge cypress/reports/.jsons/*.json -o cypress/reports/output.json
    - yarn marge cypress/reports/output.json -f AppAdmin-Cypress-Report -o cypress/reports --inline
  script:
    - node emailReport.js
  artifacts:
    expire_in: 3 days
    paths:
      - $CI_PROJECT_DIR/cypress/reports/TestReport.zip

`

const writeCypressJobs = (jobs, pipelinePath) => {
  fs.writeFileSync(pipelinePath, jobs)
}

try {
  if (!fs.existsSync(pipelineDir)) fs.mkdirSync(pipelineDir)

  let neededJobsForEmail = ''

  fs.readdirSync(specFilePath).forEach((spec) => {
    neededJobsForEmail += `   - integration_test_template_${formatJobName(spec)}\n`
    jobs += integrationTestJob(spec)
  })

  jobs += emailCypressReportJob(neededJobsForEmail)

  writeCypressJobs(jobs, path.join(pipelineDir, 'dynamic-cypress-pipeline.yml'))
} catch (err) {
  console.error(err)
}
