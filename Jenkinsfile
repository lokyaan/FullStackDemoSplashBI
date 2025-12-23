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
                    # Force remove ALL containers by name (fixes stale mysql conflict)
                    docker rm -f fullstack-mysql fullstack-backend fullstack-frontend || true
                    docker compose down || true
                    docker compose build --no-cache
                    docker compose up -d
                    sleep 10
                    docker ps
                    docker logs fullstack-backend --tail=20
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
