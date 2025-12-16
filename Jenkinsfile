pipeline {
    agent any

    stages {

        stage('Build Backend') {
            agent {
                docker {
                    image 'maven:3.9.9-eclipse-temurin-17'
                }
            }
            steps {
                sh 'cd FullStackDemo-Backend && mvn clean package -DskipTests'
            }
        }

        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:18-alpine'
                }
            }
            steps {
                sh 'cd FullStackDemo-Frontend && npm install && npm run build'
            }
        }
    }
}
