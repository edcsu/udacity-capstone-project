import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTweet } from '../../helpers/tweets'
import { UpdateTweetRequest } from '../../requests/UpdateTweetRequest'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTweet')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing updateTweet event', { event })

    const userId = getUserId(event)
    const tweetId = event.pathParameters.tweetId
    const updatedTweet: UpdateTweetRequest = JSON.parse(event.body)

    if (!updatedTweet.thought) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: "The tweet must not be empty"
        })
      }
    }
    
    await updateTweet(userId, tweetId, updatedTweet)

    logger.info(`Tweet updated succesfully with id: ${tweetId}.`)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "Tweet updated succesfully."
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
