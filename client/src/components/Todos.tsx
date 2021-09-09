import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTweet, deleteTweet, getTweets, patchTweet } from '../api/tweets-api'
import Auth from '../auth/Auth'
import { Tweet } from '../types/Tweet'

interface TweetProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Tweet[]
  newTweetName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TweetProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTweetName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTweetName: event.target.value })
  }

  onEditButtonClick = (tweetId: string) => {
    this.props.history.push(`/todos/${tweetId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newTodo = await createTweet(this.props.auth.getIdToken(), {
        thought: this.state.newTweetName,
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTweetName: ''
      })
    } catch {
      alert('Tweet creation failed')
    }
  }

  onTodoDelete = async (tweetId: string) => {
    try {
      await deleteTweet(this.props.auth.getIdToken(), tweetId)
      this.setState({
        todos: this.state.todos.filter(tweet => tweet.tweetId !== tweetId)
      })
    } catch {
      alert('Tweet deletion failed')
    }
  }

  onTodoCheck = async (pos: number) => {
    try {
      const tweet = this.state.todos[pos]
      await patchTweet(this.props.auth.getIdToken(), tweet.tweetId, {
        thought: tweet.thought,
      })
      this.setState({
        todos: update(this.state.todos, {})
      })
    } catch {
      alert('Tweet deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTweets(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e: any) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.rendercreateTweetInput()}

        {this.renderTodos()}
      </div>
    )
  }

  rendercreateTweetInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((tweet, pos) => {
          return (
            <Grid.Row key={tweet.tweetId}>
              <Grid.Column width={10} verticalAlign="middle">
                {tweet.thought}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(tweet.tweetId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(tweet.tweetId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {tweet.attachmentUrl && (
                <Image src={tweet.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
