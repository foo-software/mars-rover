import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollProvider } from '@foo-software/react-scroll-context';
import Button from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import TextField, { HelperText, Input } from '@material/react-text-field';
import '@material/react-button/dist/button.css';
import '@material/react-material-icon/dist/material-icon.css';
import '@material/react-text-field/dist/text-field.min.css';
import { homeTout } from '../content';
import Tout from '../Tout';
import DialogDatePicker from '../DialogDatePicker';
import Grid from '../Grid';
import Header from '../Header';
import Loader from '../Loader';
import ScrollContext from '../ScrollContext';
import './App.css';

const App = ({ fetchPhotosAction, isLoading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cameraName, setCameraName] = useState('');

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
            <TextField
              className="app__searchInput"
              label="Camera Name"
              helperText={<HelperText>at least 4 characters</HelperText>}
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
        <Grid cameraName={cameraName} />
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
