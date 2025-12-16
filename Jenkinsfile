pipeline {
    agent any

    stages {
        stage('Build Backend') {
            steps {
                sh 'cd FullStackDemo-Backend && mvn clean package -DskipTests'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'cd FullStackDemo-Frontend && npm install && npm run build'
            }
        }
    }
}
