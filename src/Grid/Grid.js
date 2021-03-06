import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { LazyOffscreenImage } from '@foo-software/react-lazy-offscreen-image';
import { Snackbar } from '@material/react-snackbar';
import '@material/react-snackbar/dist/snackbar.css';
import alternatePhotos from './alternatePhotos';
import ScrollContext from '../ScrollContext';
import './Grid.css';

const SNACKBAR_TIMEOUT = 5000;

// filter by full name if it includes the name provided by the
// user. case-insensitive filtering.
const getPhotos = ({ cameraName, photos }) => {
  if (!cameraName) {
    return photos;
  }

  return photos.filter(photo =>
    get(photo, 'camera.full_name', '')
      .toLowerCase()
      .includes(cameraName.toLowerCase())
  );
};

// get a leading subset of an array
const getLeadingSubset = ({ data, lastIndex }) => data.slice(0, lastIndex);

// the current number of renders. this value needs to be in the global
// scope vs local state to prevent re-renders on change.
let renderIndex = 0;

const Grid = ({ cameraName, maxPhotos, photos, setRenderProfileName }) => {
  // if we have data - we don't render a snackbar component... otherwise
  // populate it in the block below.
  let snackbar = null;

  // if we don't need to filter show the full grid... else filtered.
  let gridPhotos = useMemo(
    () =>
      getPhotos({
        cameraName,
        photos: photos.data
      }),
    [cameraName, photos.date]
  );

  // if we a max number of photos to show (not 'all') - let's slice
  // off a subset of photos.
  if (typeof maxPhotos === 'number') {
    gridPhotos = getLeadingSubset({
      lastIndex: maxPhotos,
      data: gridPhotos
    });
  }

  // if we've filtered and have no results - show all
  if (!gridPhotos.length && photos.data.length) {
    gridPhotos = photos.data;
  }

  // if no photos show alternate content
  if (!gridPhotos.length) {
    snackbar = (
      <Snackbar
        actionText="dismiss"
        className="noResults__snackbar"
        key={`snackbar${Date.now()}`}
        message="Sorry, no photos for this day."
        timeoutMs={SNACKBAR_TIMEOUT}
      />
    );

    // alternate space related imagery
    gridPhotos = alternatePhotos;
  }

  // handle render data
  setRenderProfileName(renderIndex);
  renderIndex++;

  return (
    <>
      <div className="grid">
        {gridPhotos.map(photo => (
          <div key={photo.id} className="grid__cell">
            <figure className="grid__figure">
              <LazyOffscreenImage
                className="grid__image"
                imageUrl={photo.img_src}
                ScrollContext={ScrollContext}
              />
              {photo.camera && photo.camera.full_name && (
                <figcaption>
                  <p>{photo.camera.full_name}</p>
                </figcaption>
              )}
            </figure>
          </div>
        ))}
      </div>
      {snackbar}
    </>
  );
};

Grid.propTypes = {
  cameraName: PropTypes.string.isRequired,
  maxPhotos: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  photos: PropTypes.shape({
    date: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        img_src: PropTypes.string,
        rover: PropTypes.shape({
          name: PropTypes.string,
          status: PropTypes.string
        })
      })
    )
  }),
  setRenderProfileName: PropTypes.func.isRequired
};

function areEqual(prevProps, nextProps) {
  return (
    prevProps.cameraName === nextProps.cameraName &&
    prevProps.photos.date === nextProps.photos.date &&
    prevProps.maxPhotos === nextProps.maxPhotos
  );
}

export default React.memo(Grid, areEqual);
