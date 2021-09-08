import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic

const logger = createLogger('todos')

const todosAccess = new TodosAccess()
const todosStorage = new AttachmentUtils()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`Retrieving all todos for user ${userId}`, { userId })

  return await todosAccess.getTodoItems(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()

  const newItem: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: `https://${todosStorage.getBucketName()}.s3.amazonaws.com/${todoId}`,
    ...createTodoRequest
  }

  logger.info(`Creating todo ${todoId} for user ${userId}`, { userId, todoId, todoItem: newItem })

  await todosAccess.createTodoItem(newItem)

  return newItem
}

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
  logger.info(`Updating todo ${todoId} for user ${userId}`, { userId, todoId, todoUpdate: updateTodoRequest })

  const item = await todosAccess.getTodoItem(todoId, userId)

  if (!item)
    createError(404, 'Todo not found')

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
    createError(401, 'User is not authorized to update todo')
  }

  todosAccess.updateTodoItem(todoId, userId, updateTodoRequest as TodoUpdate)
}

export async function deleteTodo(userId: string, todoId: string) {
  logger.info(`Deleting todo ${todoId} for user ${userId}`, { userId, todoId })

  const item = await todosAccess.getTodoItem(todoId, userId)

  if (!item)
    createError(404, 'Todo not found')

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to delete todo ${todoId}`)
    createError(401, 'User is not authorized to delete todo') 
  }

  todosAccess.deleteTodoItem(todoId, userId)
}

export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
  logger.info(`Generating attachment URL for attachment ${attachmentId}`)

  const attachmentUrl = await todosStorage.getAttachmentUrl(attachmentId)

  logger.info(`Updating todo ${todoId} with attachment URL ${attachmentUrl}`, { userId, todoId })

  const item = await todosAccess.getTodoItem(todoId, userId)

  if (!item)
    createError(404, 'Todo not found') 

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
    createError(401, 'User is not authorized to update todo')
  }

  await todosAccess.updateAttachmentUrl(todoId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`Generating upload URL for attachment ${attachmentId}`)

  const uploadUrl = await todosStorage.getUploadUrl(attachmentId)

  return uploadUrl
}