import boto3
import json

dynamodb = boto3.client('dynamodb')
rekognition = boto3.client('rekognition')
s3 = boto3.client('s3')



def sendMessage(message):
    topic_arn = 'arn:aws:sns:us-east-1:155649095846:HalifaxEvents'
    sns = boto3.client('sns')
    response = sns.publish(
        TopicArn=topic_arn,
        Message=message
    )
    print('Message sent:', response['MessageId'])





def flatten(arr):
    flat_arr = []
    for i in arr:
        if type(i) == list:
            flat_arr += flatten(i)
        else:
            flat_arr.append(i)
    return flat_arr



def insertIntoDB(item):
       # insert the item into the table
    response = dynamodb.put_item(
        TableName='myHalifaxEvents',
        Item=item
    )

    # return a response to the client
    return {
        'statusCode': 200,
        'body': 'Record inserted successfully'
    }
    

def Detect_key_phrases(text): 
    comprehend = boto3.client(service_name='comprehend', region_name='us-east-1')
    response = comprehend.detect_key_phrases(Text=text, LanguageCode='en')
    key_phrases=[]
    for phrase in response['KeyPhrases']:
        if(str(phrase['Text']) not in key_phrases):
            key_phrases.append(phrase['Text'].lower().split())
            
    
    key_phrases=flatten(key_phrases)
    print(key_phrases)
    
    
    # Use AWS Comprehend to detect temporal expressions in text
    entities = comprehend.detect_entities(
        Text=text,
        LanguageCode='en'
    )
    temporal_entities = [entity for entity in entities['Entities'] if entity['Type'] == 'DATE']
    print(temporal_entities)
    
    if('halifax' in key_phrases):
        item={
        'eventName': {'S':temporal_entities[0]['Text']},
        'City': {'S': 'HALIFAX'},
        'Text':{'S':text}
        }
        insertIntoDB(item)
        print("ALERT!!! There is an event in halifax at:"+temporal_entities[0]['Text'])
        message="ALERT!!! There is an event in halifax at:"+temporal_entities[0]['Text']
        sendMessage(message)
    





def Detect_text(photo, bucket):
    finalText=''
    response = rekognition.detect_text(Image={'S3Object': {'Bucket': bucket, 'Name': photo}})
    textDetections = response['TextDetections']
    # print('Detected text\n----------')
    for text in textDetections:
        if text['Type'] == 'LINE':
            finalText = finalText+" "+text['DetectedText']
            # print('Detected text:' + text['DetectedText'])
        
    # print(finalText)
    Detect_key_phrases(finalText)
    

    
    
    

def lambda_handler(event, context):
    bucket = 'mypicturesbucket'
    response = s3.list_objects_v2(Bucket=bucket)
    for obj in response['Contents']:
        Detect_text(obj['Key'],bucket)
    s3.delete_object(Bucket=bucket, Key=obj['Key'])    









