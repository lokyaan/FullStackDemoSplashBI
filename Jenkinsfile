pipeline {
    agent any

    stages {
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
    }
}
