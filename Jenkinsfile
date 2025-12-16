pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/lokyaan/FullStackDemoSplashBI.git'
      }
    }

    stage('Build Backend') {
      steps {
        sh 'cd backend && mvn clean package -DskipTests'
      }
    }

    stage('Build Frontend') {
      steps {
        sh 'cd frontend && npm install && npm run build'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose up -d'
      }
    }
  }
}
