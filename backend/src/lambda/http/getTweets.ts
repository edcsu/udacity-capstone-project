import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTweets } from '../../helpers/tweets'
import { getUserId } from '../utils';

import { createLogger } from '../../utils/logger'

const logger = createLogger('getTweets')

// Get all tweets items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing getTweets event', { event })
    
    const userId = getUserId(event)

    const tweets = await getTweets(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true},
      body: JSON.stringify({
        items: tweets
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
