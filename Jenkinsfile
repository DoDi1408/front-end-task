pipeline {
    agent any
    environment {
        OCI_CREDENTIALS = credentials('oci-user-authtoken')
        PATH = "/home/jenkins/bin:${env.PATH}"
    }
    stages{
        stage('Building with vite'){
            steps{
                script{
                    sh "npm install"
                    sh "npm test"
                    sh "npm run build"
                }
            }
        }
        stage('Build docker image'){
            steps{
                script{
                    sh 'docker build -t front-end-nginx:latest .'
                }
            }
        }
        stage('Push image to OCI Container Registry'){
            steps{
                script{
                    sh 'echo ${OCI_CREDENTIALS_PSW} | docker login --username ${OCI_CREDENTIALS_USR} --password-stdin qro.ocir.io'
                    sh 'docker tag front-end-nginx:latest qro.ocir.io/ax6svbbnc2oh/registry-front-nginx:latest'
                    sh 'docker push qro.ocir.io/ax6svbbnc2oh/registry-front-nginx:latest'
                }
            }
        }
        stage('Push to cluster'){
            steps{
                script{
                    sh 'kubectl apply -f deployment-front.yaml'
		    sh 'kubectl apply -f ingress-nginx.yaml'
                    sh 'kubectl rollout restart deployment react-deployment'
                }
            }
        }
        stage('Cleanup'){
            steps{
                script{
                    sh 'rm /home/jenkins/.docker/config.json'
                    sh 'docker logout'
                }
                cleanWs()
            }
        }
    }
}