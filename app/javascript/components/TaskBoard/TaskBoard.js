import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { propOr } from 'ramda';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import TasksRepository from 'repositories/TasksRepository';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TaskForm from 'forms/TaskForm';
import Styles from './useStyles';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

const TaskBoard = () => {
  const styles = Styles();
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => {
        const oldCards = prevState[state].cards;
        const newCards = data.items;
        return {
          ...prevState,
          [state]: { cards: [...oldCards, ...newCards], meta: data.meta },
        };
      });
    });
  };

  const generateBoard = () => {
    const board = {
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    };
    setBoard(board);
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { stateEvent: transition.event })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleCloseEditPopup = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(task.state);
      handleCloseEditPopup(MODES.NONE);
    });
  };

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(task.id, attributes).then(() => {
      loadColumnInitial(task.state);
      handleCloseEditPopup();
    });
  };

  const handleTaskDestroy = (task) => {
    // …
  };

  return (
    <div>
      <KanbanBoard
        renderCard={(card) => <Task task={card} onClick={handleOpenEditPopup} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        onCardDragEnd={handleCardDragEnd}
      >
        {board}
      </KanbanBoard>
      <Fab className={styles.addButton} color="primary" aria-label="add" onClick={handleOpenAddPopup}>
        <AddIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleCloseEditPopup} />}
      {mode === MODES.EDIT && (
        <EditPopup
          cardId={openedTaskId}
          onClose={handleCloseEditPopup}
          onCardDestroy={handleTaskDestroy}
          onLoadCard={loadTask}
          onCardUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskBoard;
