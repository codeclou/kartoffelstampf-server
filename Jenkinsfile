sh 'curl -sSLko pipeline-helper.groovy ${K8S_INFRASTRUCTURE_BASE_URL}pipeline-helper/pipeline-helper.groovy?v2'
def pipelineHelper = load("./pipeline-helper.groovy")
pipelineHelper.nodejsTemplate {
  stage('prepare tools') {
    pipelineHelper.npmWriteClientConfig()
    sh 'yarn -version'
  }
  stage('git clone') {
    // branch or tag
    sh 'git clone --single-branch --branch $GWBT_BRANCH$GWBT_TAG https://${GITHUB_AUTH_TOKEN}@github.com/${GWBT_REPO_FULL_NAME}.git source'
    // reset to revision from webhook
    dir('source') {
      sh 'git reset --hard $GWBT_COMMIT_AFTER'
    }
  }
  stage('download dependencies') {
    dir('source') {
      sh 'yarn'
    }
  }
  stage('test') {
    dir('source') {
      sh 'yarn test'
    }
  }
  stage('build') {
    dir('source') {
      sh 'yarn build'
      dir('dist') {
        sh 'zip dist.zip $(find . -mindepth 1 -not -iwholename "*.git*")'
        sh 'mv dist.zip ../'
      }
    }
  }
  stage('deploy') {
    dir('source') {
      if (env.GWBT_TAG != "" && env.GWBT_TAG ==~ 'v.*') {
        echo 'Deploying to github release'
        def releaseId = pipelineHelper.githubCreateGitHubRelease("codeclou", env.GWBT_REPO_NAME, env.GWBT_TAG, "master")
        def currentDir = pwd() + "/"
        pipelineHelper.githubUploadAssetToRelease("codeclou", env.GWBT_REPO_NAME, env.GWBT_TAG, releaseId, currentDir, "dist.zip", 'application/octet-stream')
        archiveArtifacts 'dist.zip'
      } else {
        echo 'SKIP: only deploying release tag'
      }
    }
  }
}
