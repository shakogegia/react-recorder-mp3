/**
 * @class Recorder
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import vmsg from './vmsg'

import micIcon from './mic-icon-white.svg'
import wasmURL from './vmsg.wasm'

import styles from './styles.css'

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export default class Recorder extends Component {
  static propTypes = {
    recorderParams: PropTypes.object,
    onRecordingComplete: PropTypes.func,
    onRecordingError: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    recorderParams: { },
    onRecordingComplete: () => { },
    onRecordingError: () => { },
    onStatusChange: () => { },
    renderContent: () => { },
    isRecording: false
  }

  state = {
    isRecording: false
  }

  _recorder = null

  componentDidUpdate(prevProps) {

    if(this.props.isRecording && this.props.isRecording !== prevProps.isRecording) {
      this.startRecording()
    }

    if(!this.props.isRecording && this.props.isRecording !== prevProps.isRecording) {
      this.stopRecording()
    }

  }

  componentWillUnmount() {
    this._cleanup()
  }

  render() {
    const {
      recorderParams,
      onRecordingComplete,
      onRecordingError,
      className,
      renderContent,
      ...rest
    } = this.props

    return renderContent()
  }

  _cleanup() {
    if (this._recorder) {
      this._recorder.stopRecording()
      this._recorder.close()
      delete this._recorder
    }
  }

  startRecording = () => {
    const { recorderParams } = this.props

    this._cleanup()

    this._recorder = new vmsg.Recorder({
      wasmURL,
      shimURL,
      ...recorderParams
    })

    this._recorder.init()
      .then(() => {
        this._recorder.startRecording()
        this.setState({ isRecording: true }, () => { this.emitStatusChange() })
      })
      .catch((err) => this.props.onRecordingError(err))
  }

  stopRecording = () => {
    if (this._recorder) {
      this._recorder.stopRecording()
        .then((blob) => this.props.onRecordingComplete(blob))
        .catch((err) => this.props.onRecordingError(err))
        .finally(() => { this.emitStatusChange() })
    }
  }

  emitStatusChange = () => {
    const {isRecording } = this.state
    const { onStatusChange = () => {} } = this.props
    onStatusChange(isRecording)
  }
}
