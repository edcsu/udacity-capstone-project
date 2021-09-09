import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTweet } from '../../helpers/tweets'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTweet')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing deleteTweet event', { event })
    
    const tweetId = event.pathParameters.tweetId
    
    // Remove a tweet item by id
    const userId = getUserId(event)

    await deleteTweet(userId, tweetId)

    logger.info(`Tweet with id: ${tweetId} deleted succesfully.`)

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
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
