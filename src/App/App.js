import React, { Profiler, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollProvider } from '@foo-software/react-scroll-context';
import Button from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import TextField, { Input } from '@material/react-text-field';
import Radio, { NativeRadioControl } from '@material/react-radio';
import '@material/react-button/dist/button.css';
import '@material/react-material-icon/dist/material-icon.css';
import '@material/react-text-field/dist/text-field.min.css';
import '@material/react-radio/dist/radio.min.css';
import { homeTout } from '../content';
import { getProfileData, logProfileData } from '../profiler';
import Tout from '../Tout';
import DialogDatePicker from '../DialogDatePicker';
import Grid from '../Grid';
import Header from '../Header';
import Loader from '../Loader';
import ScrollContext from '../ScrollContext';
import './App.css';

// the current number of renders. this value needs to be in the global
// scope vs local state to prevent re-renders on change.
let renderProfiles = [];

const App = ({ fetchPhotosAction, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cameraName, setCameraName] = useState('');
  const [maxPhotos, setMaxPhotos] = useState(5);

  const setRenderProfileData = renderIndex => {
    if (renderProfiles.length) {
      logProfileData({
        name: `render: ${renderIndex}`,
        data: renderProfiles
      });
      renderProfiles = [];
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  // fetch photos on mount
  useEffect(() => {
    fetchPhotosAction();
  }, []);

  return (
    <ScrollProvider Context={ScrollContext}>
      <div className="app">
        <Header />
        <Tout
          altText="Mars Rover"
          imageUrl="https://s3.us-west-2.amazonaws.com/hensonism/code/rover.jpg"
        >
          <p>{homeTout}</p>
        </Tout>
        <div className="app__headline">
          <h1>Mars Rover Photos of the Day</h1>
          <div>
            <div>
              <TextField
                className="app__searchInput"
                label="Camera Name"
                trailingIcon={<MaterialIcon icon="search" />}
              >
                <Input
                  value={cameraName}
                  onChange={event => setCameraName(event.currentTarget.value)}
                  spellCheck="false"
                  type="text"
                  id="cameraNameInput"
                  isValid
                />
              </TextField>
              <div className="app_radio--max-photos">
                <Radio label="5" key="maxPhotos5">
                  <NativeRadioControl
                    checked={maxPhotos === 5}
                    name="maxPhotos"
                    value="5"
                    id="maxPhotos5"
                    onChange={() => setMaxPhotos(5)}
                  />
                </Radio>
                <Radio label="10" key="maxPhotos10">
                  <NativeRadioControl
                    checked={maxPhotos === 10}
                    name="maxPhotos"
                    value="10"
                    id="maxPhotos10"
                    onChange={() => setMaxPhotos(10)}
                  />
                </Radio>
                <Radio label="all" key="maxPhotosAll">
                  <NativeRadioControl
                    checked={maxPhotos === 'all'}
                    name="maxPhotos"
                    value="all"
                    id="maxPhotosAll"
                    onChange={() => setMaxPhotos('all')}
                  />
                </Radio>
              </div>
            </div>
            <Button
              className="app__buttonFilter"
              onClick={toggleDialog}
              icon={<MaterialIcon icon="date_range" />}
              unelevated
            >
              Filter
            </Button>
          </div>
        </div>
        <Profiler
          id="Grid"
          onRender={(...profileData) => {
            renderProfiles.push(getProfileData(profileData));
          }}
        >
          <Grid
            maxPhotos={maxPhotos}
            cameraName={cameraName}
            setRenderProfileName={setRenderProfileData}
          />
        </Profiler>
        <DialogDatePicker isOpen={isDialogOpen} toggle={toggleDialog} />
        <Loader isActive={isLoading} />
      </div>
    </ScrollProvider>
  );
};

App.propTypes = {
  fetchPhotosAction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default App;
