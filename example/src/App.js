import React, { Component } from 'react'

import Recorder from 'react-recorder-mp3'
import ReactAudioPlayer from 'react-audio-player'

import blobToBuffer from 'blob-to-buffer'
import ribbon from './ribbon.png'

export default class App extends Component {
  state = {
    url: '',
    isRecording: false
  }

  onStatusChange = (isRecording) => {
    console.log("TCL: App -> onStatusChange -> isRecording", isRecording)
    this.setState({ isRecording })
  }

  togglePlay = () => {
    this.setState({ isRecording: !this.state.isRecording  })
    console.log("TCL: App -> togglePlay -> this.state.isRecording", this.state.isRecording)
  }

  _renderContent = () => {
    return (
      <button onClick={this.togglePlay}>
        Record
      </button>
    )
  }

  render () {
    const {
      url
    } = this.state

    return (
      <div>

        <span>
          isRecording: {String(this.state.isRecording)}
        </span>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '100vh'
          }}
        >
          <div>
            <Recorder
              onRecordingComplete={this._onRecordingComplete}
              onRecordingError={this._onRecordingError}
              onStatusChange={this._onStatusChange}
              renderContent={this._renderContent}
              isRecording={this.state.isRecording}
              
              style={{
                margin: '0 auto'
              }}
            />

            <p>
              Click and hold to start recording.
            </p>

            {url && (
              <div>
                <ReactAudioPlayer
                  src={url}
                  controls
                  style={{
                    minWidth: '500px'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  _onRecordingComplete = (blob) => {
    blobToBuffer(blob, (err, buffer) => {
      if (err) {
        console.error(err)
        return
      }

      console.log('recording', blob)

      if (this.state.url) {
        window.URL.revokeObjectURL(this.state.url)
      }

      this.setState({
        url: window.URL.createObjectURL(blob)
      })
    })
  }

  _onRecordingError = (err) => {
    console.log('error recording', err)

    if (this.state.url) {
      window.URL.revokeObjectURL(this.state.url)
    }

    this.setState({ url: null })
  }
}
