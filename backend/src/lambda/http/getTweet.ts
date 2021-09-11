import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTweet } from '../../helpers/tweets'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('getTweet')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing getTweet event', { event })

    const userId = getUserId(event)
    const tweetId = event.pathParameters.tweetId

    const tweet = await getTweet(userId, tweetId)

    logger.info(`Retrieved Tweet succesfully with id: ${tweetId}.`)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        tweet
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
