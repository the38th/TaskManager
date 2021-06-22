import React from 'react';
import PropTypes from 'prop-types';
import { has, isNil } from 'ramda';

import UserSelect from 'components/UserSelect';
import ImageUpload from 'components/ImageUpload';
import TaskPresenter from 'presenters/TaskPresenter';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import useStyles from './useStyles';

const Form = ({ errors, onChange, task, handleSelectChange, onImageAttach, onImageRemove }) => {
  const handleTextFieldChange = ({ target: { name, value } }) => onChange({ ...task, [name]: value });
  const styles = useStyles();

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        name="name"
        onChange={handleTextFieldChange}
        value={TaskPresenter.name(task)}
        label="Name"
        required
        margin="dense"
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        name="description"
        onChange={handleTextFieldChange}
        value={TaskPresenter.description(task)}
        label="Description"
        required
        multiline
        margin="dense"
      />
      <UserSelect
        label="Author"
        value={TaskPresenter.author(task)}
        onChange={handleSelectChange('author')}
        isDisabled
        isRequired
        error={has('author', errors)}
        helperText={errors.author}
      />
      <UserSelect
        label="Assignee"
        value={TaskPresenter.assignee(task)}
        onChange={handleSelectChange('assignee')}
        isClearable
        error={has('assignee', errors)}
        helperText={errors.assignee}
      />
      {isNil(TaskPresenter.imageUrl(task)) ? (
        <div className={styles.imageUploadContainer}>
          <ImageUpload onImageUpload={onImageAttach} />
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <img className={styles.preview} src={TaskPresenter.imageUrl(task)} alt="Attachment" />
          <Button variant="contained" size="small" color="primary" onClick={onImageRemove}>
            Remove image
          </Button>
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  task: PropTypes.shape().isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string),
  }),
  onImageAttach: PropTypes.func.isRequired,
  onImageRemove: PropTypes.func.isRequired,
};

Form.defaultProps = {
  errors: {},
};

export default Form;
