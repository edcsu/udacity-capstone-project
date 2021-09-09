import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTweetRequest } from '../../requests/CreateTweetRequest'
import { getUserId } from '../utils';
import { createTweet } from '../../helpers/tweets'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTweet')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    logger.info('Processing createTweet event', { event })
      
    // Create a new Tweet item
    const userId = getUserId(event)
    const newTweet: CreateTweetRequest = JSON.parse(event.body)

    const newItem = await createTweet(userId, newTweet)

    logger.info(`A new tweet was created.`)
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
