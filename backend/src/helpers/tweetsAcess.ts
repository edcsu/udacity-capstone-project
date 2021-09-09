import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Tweet } from '../models/Tweet'
import { TweetUpdate } from '../models/TweetUpdate';

const logger = createLogger('TweetsAccess')

// TODO: Implement the dataLayer logic
export class TweetsAccess {

    constructor(
      private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly todosByUserIndex = process.env.TODOS_BY_USER_INDEX
    ) {}
  
    async tweetItemExists(tweetId: string, userId: string): Promise<boolean> {
      const item = await this.getTweetItem(tweetId, userId)
      return !!item
    }
  
    async getTweetItems(userId: string): Promise<Tweet[]> {
      logger.info(`Getting all tweets for user ${userId} from ${this.todosTable}`)
  
      const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todosByUserIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise()
  
      const items = result.Items
  
      logger.info(`Found ${items.length} tweets for user ${userId} in ${this.todosTable}`)
  
      return items as Tweet[]
    }
  
    async getTweetItem(tweetId: string, userId: string): Promise<Tweet> {
      logger.info(`Getting tweet ${tweetId} from ${this.todosTable}`)
  
      const result = await this.docClient.get({
        TableName: this.todosTable,
        Key: {
          tweetId,
          userId
        }
      }).promise()
  
      const item = result.Item
  
      return item as Tweet
    }
  
    async createTweetItem(Tweet: Tweet) {
      logger.info(`Putting tweet ${Tweet.tweetId} into ${this.todosTable}`)
  
      await this.docClient.put({
        TableName: this.todosTable,
        Item: Tweet,
      }).promise()
    }
  
    async updateTweetItem(tweetId: string, userId: string, TweetUpdate: TweetUpdate) {
      logger.info(`Updating tweet item ${tweetId} in ${this.todosTable}`)
  
      await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          tweetId,
          userId
        },
        UpdateExpression: 'set #thought = :thought',
        ExpressionAttributeNames: {
          "#thought": "thought"
        },
        ExpressionAttributeValues: {
          ":thought": TweetUpdate.thought
        }
      }).promise()   
    }
  
    async deleteTweetItem(tweetId: string, userId: string) {
      logger.info(`Deleting tweet item ${tweetId} from ${this.todosTable}`)
  
      await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          tweetId,
          userId
        }
      }).promise()    
    }
  
    async updateAttachmentUrl(tweetId: string, attachmentUrl: string) {
      logger.info(`Updating attachment URL for tweet ${tweetId} in ${this.todosTable}`)
  
      await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          tweetId,
          // userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      }).promise()
    }
  
  }