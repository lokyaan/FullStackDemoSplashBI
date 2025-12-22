pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                sh '''
                    docker-compose down || true
                    docker-compose build --no-cache
                    docker-compose up -d
                    docker ps
                '''
            }
        }
    }

    post {
        always { echo 'Pipeline finished' }
        success { echo ' App is up (frontend + backend)' }
        failure { echo ' Build/deploy failed' }
    }
}
