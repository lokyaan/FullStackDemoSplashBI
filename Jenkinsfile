pipeline {
    agent any

    triggers{
        githubPush()
    }

    stages {

        stage('Build Backend') {
            steps {
                sh '''
                    echo "=== Backend Build ==="
                    cd FullStackDemo-Backend
                    chmod +x gradlew
                    ./gradlew clean build -x test
                '''
            }
        }

        
        stage('Build Frontend') {
            steps {
                sh '''
                    echo "=== Frontend Build ==="
                    cd FullStackDemo-Frontend
                    npm install
                    npm run build
                '''
            }
        }

        stage('Docker build and deploy'){
            steps{
                sh'''
                    echo "Stopping old containers"
                    docker-compose down || true

                    echo "Building and starting new containers"
                    docker-compose up -d --build

                '''
            }
        }
    }

    post {
        success {
            echo ' CI pipeline completed successfully'
            echo ' Application deployed successfully'
        }
        failure {
            echo ' CI pipeline failed'
            echo ' Application deploy failed'
        }
        always {
            echo ' Pipeline finished'
        }
    }
}
