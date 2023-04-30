import json
import boto3
import os

# # Initialize the AWS SDK clients
dynamodb = boto3.resource('dynamodb')
table_name = 'PictureAppUsers'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    # Get the request body
    
    print(event['email'])
    
    # Check if the user already exists in the database
    response = table.get_item(
        Key={
            'email': event['email']
        }
    )
    
    if 'Item' in response:
        # User already exists, return an error response
        return {
            'statusCode': 409,
            'body': json.dumps({'error': 'User already exists'})
        }
    else:
        # User does not exist, add them to the database
        table.put_item(
            Item={
                'email': event['email'],
                'name': event['name'],
                'password':event['password']
            }
        )
        
        
        
    #     # Return a success response
    return {
        'statusCode': 200,
        'body': json.dumps({'email': event['email']})
    }
    

