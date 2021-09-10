import { apiEndpoint } from '../config'
import { Tweet } from '../types/Tweet';
import { createTweetRequest } from '../types/createTweetRequest';
import Axios from 'axios'
import { UpdateTweetRequest } from '../types/UpdateTweetRequest';

export async function getTweets(idToken: string): Promise<Tweet[]> {
  console.log('Fetching tweets')

  const response = await Axios.get(`${apiEndpoint}/tweets`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Tweets:', response.data)
  return response.data.items
}

export async function createTweet(
  idToken: string,
  newTodo: createTweetRequest
): Promise<Tweet> {
  const response = await Axios.post(`${apiEndpoint}/tweets`,  JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTweet(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTweetRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/tweets/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTweet(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/tweets/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/tweets/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
