import { TweetsAccess } from './tweetsAcess'
import { AttachmentUtils } from './attachmentUtils';
import { Tweet } from '../models/Tweet'
import { CreateTweetRequest } from '../requests/CreateTweetRequest'
import { UpdateTweetRequest } from '../requests/UpdateTweetRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TweetUpdate } from '../models/TweetUpdate';

// tweet: Implement businessLogic

const logger = createLogger('tweets')

const tweetsAccess = new TweetsAccess()
const tweetsStorage = new AttachmentUtils()

export async function getTweets(userId: string): Promise<Tweet[]> {
  logger.info(`Retrieving all tweets for user ${userId}`, { userId })

  return await tweetsAccess.getTweetItems(userId)
}

export async function createTweet(userId: string, createTodoRequest: CreateTweetRequest): Promise<Tweet> {
  const tweetId = uuid.v4()

  const newItem: Tweet = {
    userId,
    tweetId,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${tweetsStorage.getBucketName()}.s3.amazonaws.com/${tweetId}`,
    ...createTodoRequest
  }

  logger.info(`Creating tweet ${tweetId} for user ${userId}`, { userId, tweetId, Tweet: newItem })

  await tweetsAccess.createTweetItem(newItem)

  return newItem
}

export async function updateTweet(userId: string, tweetId: string, updateTodoRequest: UpdateTweetRequest) {
  logger.info(`Updating tweet ${tweetId} for user ${userId}`, { userId, tweetId, TweetUpdate: updateTodoRequest })

  const item = await tweetsAccess.getTweetItem(tweetId, userId)

  if (!item)
    createError(404, 'tweet not found')

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update tweet ${tweetId}`)
    createError(401, 'User is not authorized to update tweet')
  }

  tweetsAccess.updateTweetItem(tweetId, userId, updateTodoRequest as TweetUpdate)
}

export async function deleteTweet(userId: string, tweetId: string) {
  logger.info(`Deleting tweet ${tweetId} for user ${userId}`, { userId, tweetId })

  const item = await tweetsAccess.getTweetItem(tweetId, userId)

  if (!item)
    createError(404, 'tweet not found')

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to delete tweet ${tweetId}`)
    createError(401, 'User is not authorized to delete tweet') 
  }

  tweetsAccess.deleteTweetItem(tweetId, userId)
}

export async function updateAttachmentUrl(userId: string, tweetId: string, attachmentId: string) {
  logger.info(`Generating attachment URL for attachment ${attachmentId}`)

  const attachmentUrl = await tweetsStorage.getAttachmentUrl(attachmentId)

  logger.info(`Updating tweet ${tweetId} with attachment URL ${attachmentUrl}`, { userId, tweetId })

  const item = await tweetsAccess.getTweetItem(tweetId, userId)

  if (!item)
    createError(404, 'tweet not found') 

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update tweet ${tweetId}`)
    createError(401, 'User is not authorized to update tweet')
  }

  await tweetsAccess.updateAttachmentUrl(tweetId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`Generating upload URL for attachment ${attachmentId}`)

  const uploadUrl = await tweetsStorage.getUploadUrl(attachmentId)

  return uploadUrl
}