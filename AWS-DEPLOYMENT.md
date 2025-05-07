
# PharmInventory AWS Deployment Guide

This guide provides step-by-step instructions for deploying the PharmInventory application on AWS Free Tier services.

## Prerequisites

1. **AWS Account**: Create an AWS account with Free Tier eligibility at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI**: Install the [AWS CLI](https://aws.amazon.com/cli/) on your local machine
3. **GitHub Repository**: Your PharmInventory codebase on GitHub
4. **Domain Name** (Optional): For custom domain setup

## Free Tier Services Used

- **AWS Amplify**: For hosting the React frontend
- **Amazon RDS**: For PostgreSQL database
- **Amazon S3**: For storing static assets
- **Amazon CloudFront**: For content delivery network (optional)
- **AWS Lambda**: For serverless backend functions
- **Amazon API Gateway**: For API endpoints

## Step-by-Step Deployment Guide

### 1. Database Setup with Amazon RDS PostgreSQL

1. **Launch a PostgreSQL instance**:
   - Sign in to the AWS Management Console
   - Navigate to RDS > Create database
   - Select PostgreSQL engine
   - Choose "Free tier" template
   - Configure settings:
     - Instance identifier: `pharminventory-db`
     - Master username: (choose a username)
     - Master password: (create a strong password)
   - Under Connectivity, ensure VPC security group allows connections on port 5432
   - Create database

2. **Import database schema**:
   - Connect to your RDS instance using a PostgreSQL client
   - Run the schema SQL script from `src/server/schema.sql` to create tables

### 2. Backend Deployment with AWS Lambda and API Gateway

1. **Create Lambda functions**:
   - Navigate to AWS Lambda > Create function
   - Choose "Author from scratch"
   - Name: `pharminventory-api`
   - Runtime: Node.js 16.x
   - Role: Create a new role with basic Lambda permissions
   - Create function

2. **Deploy backend code**:
   - Prepare your backend code:
     ```bash
     # Create a deployment package
     cd src/server
     npm install
     zip -r ../lambda-deployment.zip .
     ```
   - Upload the zip file to Lambda
   - Configure environment variables:
     - DATABASE_URL: Your RDS connection string
     - RESEND_API_KEY: Your Resend API key
     - TWILIO_ACCOUNT_SID: Your Twilio account SID
     - TWILIO_AUTH_TOKEN: Your Twilio auth token
     - TWILIO_PHONE_NUMBER: Your Twilio phone number

3. **Set up API Gateway**:
   - Navigate to API Gateway > Create API
   - Choose REST API > Build
   - Name: `pharminventory-api`
   - Create API
   - Create resources and methods to match your API routes
   - For each method:
     - Integration type: Lambda Function
     - Lambda Function: `pharminventory-api`
   - Deploy API to a new stage named "prod"
   - Note the API Gateway endpoint URL

### 3. Frontend Deployment with AWS Amplify

1. **Prepare your frontend**:
   - Update API endpoints in your code to use the API Gateway URL
   - Create a `amplify.yml` file in your project root:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

2. **Deploy with Amplify Console**:
   - Navigate to AWS Amplify > Host web app
   - Connect to your GitHub repository
   - Select the main/master branch
   - Configure build settings (use default or customize)
   - Deploy

3. **Configure environment variables**:
   - In Amplify Console, go to App settings > Environment variables
   - Add:
     - VITE_API_URL: Your API Gateway URL

### 4. Set Up CloudFront (Optional)

1. **Create a CloudFront distribution**:
   - Navigate to CloudFront > Create distribution
   - Origin Domain: Your Amplify app URL
   - Configure caching behavior as needed
   - Create distribution

2. **Configure custom domain** (optional):
   - In Route 53, create or select your hosted zone
   - Create a record that points to your CloudFront distribution

### 5. Connect Services

1. **Update security groups and access**:
   - Ensure Lambda can connect to RDS
   - Configure API Gateway CORS settings to allow requests from your frontend domain

2. **Test the deployment**:
   - Open your Amplify app URL
   - Verify all features are working correctly

## Monitoring and Management

1. **Set up CloudWatch alerts**:
   - Navigate to CloudWatch > Alarms > Create alarm
   - Set up alerts for Lambda errors, RDS performance, etc.

2. **Review AWS Free Tier limits**:
   - Monitor usage to stay within Free Tier limits
   - Set up billing alerts to notify you if approaching limits

3. **Enable logging**:
   - Configure CloudWatch logs for Lambda functions
   - Set up RDS logging for database operations

## Troubleshooting Common Issues

1. **CORS errors**: Check API Gateway CORS configuration
2. **Database connection failures**: Verify security group rules and credentials
3. **Lambda timeouts**: Increase timeout settings for complex operations
4. **Deployment failures**: Review Amplify build logs

## Cost Optimization

1. **Monitor resource usage** in AWS Cost Explorer
2. **Use AWS Budgets** to set spending limits
3. **Clean up unused resources** like S3 objects or idle RDS instances
4. **Configure Auto Scaling** to scale down during off-peak hours

## Security Best Practices

1. **Enable AWS IAM** for fine-grained access control
2. **Use secrets manager** for storing sensitive credentials
3. **Configure security groups** to restrict network access
4. **Enable AWS WAF** to protect against web attacks
5. **Implement SSL/TLS** for all communications

## Updating Your Application

1. **Set up CI/CD pipeline** with Amplify and GitHub
2. **Implement blue/green deployments** for zero-downtime updates
3. **Use feature flags** to safely roll out new features

By following these steps, you'll have a fully functional PharmInventory application deployed on AWS Free Tier services, with a secure database, API layer, and frontend hosting.
