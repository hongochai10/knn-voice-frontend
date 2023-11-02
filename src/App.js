import React from 'react';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import 'audio-react-recorder/dist/index.css';
import './index.css'
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      recordState: null,
      audioData: null,
      audioDataRef: null
    };
  }

  changeTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  start = () => {
    this.setState({
      recordState: RecordState.START,
    });
  };

  pause = () => {
    this.setState({
      recordState: RecordState.PAUSE,
    });
  };

  stop = () => {
    this.setState({
      recordState: RecordState.STOP,
    });
  };

  onStop = (data) => {
    this.setState({
      audioData: data,
    });
    console.log('onStop: audio data', data);
  };

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    const audioDataRef = {
      url: URL.createObjectURL(file),
      blob: file,
    };
    this.setState({ audioDataRef });
  };

  handleFileUploadSrc = (event) => {
    const file = event.target.files[0];
    const audioData = {
      url: URL.createObjectURL(file),
      blob: file,
    };
    this.setState({ audioData });
  };

  handleUpload = () => {
    const { audioData, audioDataRef } = this.state;

    if (!audioData || !audioDataRef) {
      console.log('Please record and upload a reference file.');
      return;
    }

    const formData = new FormData();
    formData.append('src_wav', audioData.blob);
    formData.append('ref_wav', audioDataRef.blob);

    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint where you want to send the audio data.
    axios.post('http://127.0.0.1:5000/process_audio', formData)
      .then((response) => {
        // Handle the response from the server, if needed.
        console.log('Upload successful', response.data);
      })
      .catch((error) => {
        console.error('Upload failed', error);
      });
  };

  render() {
    const { recordState, activeTab } = this.state;
    // console.log(recordState);
    return (
      <>
        <div className='App'>
          <h1>Voice Conversion App</h1>

          <div style={{ textAlign: 'center' }}>
            <div className="tabs">
              <button
                onClick={() => this.changeTab('1')}
                className={`tab-button ${activeTab === 'src' ? 'active' : ''} custom-button tab-button`}
              >
                Recording Voice
              </button>
              <button
                onClick={() => this.changeTab('2')}
                className={`tab-button ${activeTab === 'ref' ? 'active' : ''} custom-button tab-button`}
              >
                File Voice
              </button>
            </div>

            {activeTab === '1' && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <h5>Src Voice</h5>
                  <AudioReactRecorder
                    state={recordState}
                    onStop={this.onStop}
                    backgroundColor='rgb(255,255,255)'
                  />
                  <audio
                    id='audio'
                    controls
                    src={this.state.audioData ? this.state.audioData.url : null}
                  ></audio>
                  <div style={{ margin: '20px' }} className="control-buttons">
                    <button id='record' onClick={this.start} className="custom-button start-button">
                      Bắt đầu
                    </button>
                    <button id='pause' onClick={this.pause} className="custom-button pause-button">
                      Tạm dừng
                    </button>
                    <button id='stop' onClick={this.stop} className="custom-button stop-button">
                      Dừng
                    </button>
                  </div>
                  <div>
                    <h5>Ref Voice</h5>
                    <input type='file' accept='audio/wav' onChange={this.handleFileUpload} classname='custom-file-input' />
                  </div>

                  <button id='submit' onClick={this.handleUpload} className="custom-button submit-button">
                    Gửi
                  </button>

                </div>
              </>
            )}

            {activeTab === '2' && (
              <>
                <div>
                  <h5>Src Voice</h5>
                  <input type='file' accept='audio/wav' onChange={this.handleFileUploadSrc} classname='custom-file-input' />
                </div>
                <div>
                  <h5>Ref Voice</h5>
                  <input type='file' accept='audio/wav' onChange={this.handleFileUpload} classname='custom-file-input' />
                </div>

                <button id='submit' onClick={this.handleUpload} className="custom-button submit-button">
                  Gửi
                </button>
              </>
            )}

          </div>




        </div>
      </>

    );
  }
}

export default App;
