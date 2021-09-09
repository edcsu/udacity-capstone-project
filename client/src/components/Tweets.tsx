import dateFormat from 'dateformat'
import { History } from 'history'
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

import { createTweet, deleteTweet, getTweets } from '../api/tweets-api'
import Auth from '../auth/Auth'
import { Tweet } from '../types/Tweet'

interface TweetProps {
  auth: Auth
  history: History
}

interface TweetsState {
  tweets: Tweet[]
  newTweetName: string
  loadingTodos: boolean
}

export class Tweets extends React.PureComponent<TweetProps, TweetsState> {
  state: TweetsState = {
    tweets: [],
    newTweetName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTweetName: event.target.value })
  }

  onEditButtonClick = (tweetId: string) => {
    this.props.history.push(`/tweets/${tweetId}/edit`)
  }

  onTweetCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newTodo = await createTweet(this.props.auth.getIdToken(), {
        thought: this.state.newTweetName,
      })
      this.setState({
        tweets: [...this.state.tweets, newTodo],
        newTweetName: ''
      })
    } catch {
      alert('Tweet creation failed')
    }
  }

  onTweetDelete = async (tweetId: string) => {
    try {
      await deleteTweet(this.props.auth.getIdToken(), tweetId)
      this.setState({
        tweets: this.state.tweets.filter(tweet => tweet.tweetId !== tweetId)
      })
    } catch {
      alert('Tweet deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const tweets = await getTweets(this.props.auth.getIdToken())
      this.setState({
        tweets: tweets,
        loadingTodos: false
      })
    } catch (e: any) {
      alert(`Failed to fetch tweets: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TWEETS</Header>

        {this.rendercreateTweetInput()}

        {this.renderTweets()}
      </div>
    )
  }

  rendercreateTweetInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'twitter',
              labelPosition: 'left',
              icon: 'twitter',
              content: 'New tweet',
              onClick: this.onTweetCreate
            }}
            fluid
            actionPosition="left"
            placeholder="#Udacity is awesome..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTweets() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTweetsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TWEETS
        </Loader>
      </Grid.Row>
    )
  }

  renderTweetsList() {
    return (
      <Grid padded>
        {this.state.tweets.map((tweet, pos) => {
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
                  onClick={() => this.onTweetDelete(tweet.tweetId)}
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
