pipeline {
    agent any

    stages {

        stage('Build Backend') {
            agent {
                docker {
                    image 'gradle:8.7-jdk21'
                    args '-u root:root'
                }
            }
            steps {
                sh '''
                    echo "=== Backend Build ==="
                    pwd
                    ls -la

                    cd FullStackDemo-Backend

                    chmod +x gradlew
                    ./gradlew clean build -x test
                '''
            }
        }

        
        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                }
            }
            steps {
                sh '''
                    echo "=== Frontend Build ==="
                    pwd
                    ls -la

                    cd FullStackDemo-Frontend
                    npm install
                    npm run build
                '''
            }
        }
    }

    post {
        success {
            echo ' CI pipeline completed successfully'
        }
        failure {
            echo ' CI pipeline failed'
        }
        always {
            echo ' Pipeline finished'
        }
    }
}
