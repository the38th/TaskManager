import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useStyles from './useStyles';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import Button from '@material-ui/core/Button';
import { isNil, path } from 'ramda';

const DEFAULT_CROP_PARAMS = {
  x: 0,
  y: 0,
  aspect: 1,
};

const ImageUpload = ({ onImageUpload }) => {
  const styles = useStyles();

  const [fileAsBase64, changeFileAsBase64] = useState(null);
  const [cropParams, changeCropParams] = useState(DEFAULT_CROP_PARAMS);
  const [file, changeFile] = useState(null);
  const [image, changeImage] = useState(null);

  const handleCropComplete = (newCrop, newPercentageCrop) => {
    changeCropParams(newPercentageCrop);
  };

  const onImageLoaded = (loadedImage) => {
    const newCropParams = makeAspectCrop(DEFAULT_CROP_PARAMS, loadedImage.width, loadedImage.height);
    changeCropParams(newCropParams);
    changeImage(loadedImage);
    return false;
  };

  const getActualCropParameters = (width, height, params) => ({
    cropX: (params.x * width) / 100,
    cropY: (params.y * height) / 100,
    cropWidth: (params.width * width) / 100,
    cropHeight: (params.height * height) / 100,
  });

  const handleCropChange = (_, newCropParams) => {
    changeCropParams(newCropParams);
  };

  const handleCropSave = () => {
    const { naturalWidth: width, naturalHeight: height } = image;
    const actualCropParams = getActualCropParameters(width, height, cropParams);
    onImageUpload(actualCropParams, file);
  };

  const handleImageRead = (newImage) => changeFileAsBase64(path(['target', 'result'], newImage));

  const handleLoadFile = (e) => {
    e.preventDefault();

    const [acceptedFile] = e.target.files;

    const fileReader = new FileReader();
    fileReader.onload = handleImageRead;
    fileReader.readAsDataURL(acceptedFile);
    changeFile(acceptedFile);
  };

  return fileAsBase64 ? (
    <>
      <div className={styles.crop}>
        <ReactCrop
          src={fileAsBase64}
          crop={cropParams}
          onImageLoaded={onImageLoaded}
          onComplete={handleCropComplete}
          onChange={handleCropChange}
          keepSelection
        />
      </div>
      <Button variant="contained" size="small" color="primary" disabled={isNil(image)} onClick={handleCropSave}>
        Save
      </Button>
    </>
  ) : (
    <label htmlFor="imageUpload">
      <Button variant="contained" size="small" color="primary" component="span">
        Add Image
      </Button>
      <input accept="image/*" id="imageUpload" type="file" onChange={handleLoadFile} hidden />
    </label>
  );
};

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
};

export default ImageUpload;
