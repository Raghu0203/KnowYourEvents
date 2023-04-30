ynimport boto3
import json
import os

# # Initialize the AWS SDK clients
dynamodb = boto3.resource('dynamodb')
table_name = 'PictureAppUsers'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    
    

    email = event['email']
    
    password = event['password']
    
    print(event)
    
    user = get_user_by_email(email)
    if not user:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Invalid email or password'})
        }
        
    # print(user)
    
    
#     # password_match = bcrypt.checkpw(password.encode('utf-8'), user['password'].value)

    print(str(password)==str(user['password']))
    if not (str(password)==str(user['password'])):
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Invalid email or password'})
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Login successful', 'user_id': user['email']})
    }
    
def get_user_by_email(email):
    response = table.scan(
        FilterExpression='email = :email',
        ExpressionAttributeValues={':email': email}
    )
    items = response['Items']
    if len(items) == 0:
        return None
    return items[0]
