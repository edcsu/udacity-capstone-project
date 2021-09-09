import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTweet } from '../../helpers/tweets'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTweet')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing updateTweet event', { event })

    const userId = getUserId(event)
    const tweetId = event.pathParameters.tweetId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a tweet item with the provided id using values in the "updatedTweet" object

    await updateTweet(userId, tweetId, updatedTodo)

    logger.info(`Tweet updated succesfully with id: ${tweetId}.`)

    return {
      statusCode: 200,
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
