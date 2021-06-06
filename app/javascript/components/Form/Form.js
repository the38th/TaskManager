import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import UserSelect from 'components/UserSelect';
import TextField from '@material-ui/core/TextField';

import useStyles from './useStyles';

const Form = ({ errors, onChange, task, handleChangeSelect }) => {
  const handleChangeTextField = ({ target: { name, value } }) => onChange({ ...task, [name]: value });
  const styles = useStyles();

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        name="name"
        onChange={handleChangeTextField}
        value={task.name}
        label="Name"
        required
        margin="dense"
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        name="description"
        onChange={handleChangeTextField}
        value={task.description}
        label="Description"
        required
        multiline
        margin="dense"
      />
      <UserSelect
        label="Author"
        value={task.author}
        onChange={handleChangeSelect('author')}
        isDisabled
        isRequired
        error={has('author', errors)}
        helperText={errors.author}
      />
      <UserSelect
        label="Assignee"
        value={task.assignee}
        onChange={handleChangeSelect('assignee')}
        isClearable
        error={has('assignee', errors)}
        helperText={errors.assignee}
      />
    </form>
  );
};

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleChangeSelect: PropTypes.func.isRequired,
  task: PropTypes.shape().isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string),
  }),
};

Form.defaultProps = {
  errors: {},
};

export default Form;
