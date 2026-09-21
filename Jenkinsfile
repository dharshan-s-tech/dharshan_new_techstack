node {
checkout scm
if (env.BRANCH_NAME == 'Prod') {
load 'CD/Jenkinsfile'
} else {
load 'CI/Jenkinsfile'
}
}