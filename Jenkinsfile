pipeline {
    agent {
        docker {
            image 'docker:27-cli'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy with Docker Compose') {
            steps {
                sh '''
                    echo "Stopping old containers..."
                    docker compose down || true

                    echo "Building images..."
                    docker compose build --no-cache

                    echo "Starting containers..."
                    docker compose up -d

                    echo "Running containers:"
                    docker ps
                '''
            }
        }
    }

    post {
        success {
            echo ' App is UP (frontend + backend)'
        }
        failure {
            echo ' Build / Deploy failed'
        }
        always {
            echo 'Pipeline finished'
        }
    }
}
