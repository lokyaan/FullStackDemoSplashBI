pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            steps {
                sh '''
                    docker compose down || true
                    docker compose build --no-cache
                    docker compose up -d
                    docker ps
                '''
            }
        }
    }

    post {
        success {
            echo ' App running successfully'
        }
        failure {
            echo ' Build / Deploy failed'
        }
        always {
            echo 'Pipeline finished'
        }
    }
}
