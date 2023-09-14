/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
import React, {
  useEffect, useReducer, useRef,
} from 'react';

import Button from '../../components/button';
import EditIcon from '../../components/icons/EditIcon';
import TrashIcon from '../../components/icons/TrashIcon';

import styles from './task-manager.module.css';

export type TTaskItemDTM = {
  _id: string
  title: string
  completed: boolean
}

type TState = {
  loading: boolean,
  error: string | null
  tasks: TTaskItemDTM[],
  selectedId: string | null
  inputValue: string,
}

const initialState: TState = {
  loading: true,
  error: null,
  tasks: [],
  selectedId: null,
  inputValue: '',
};

type TAction = {
  type: 'loadTasksError'
  error: string
} | {
  type: 'loadTasksSuccess'
  tasks: TTaskItemDTM[]
} | {
  type: 'addTask'
  taskId: string
  title: string
} | {
  type: 'deleteTask'
  taskId: string
} | {
  type: 'updateTask'
  taskId: string
  title?: string
  completed?: boolean
} | {
  type: 'updateInputValue',
  value: string
} | {
  type: 'selectTask',
  taskId: string | null
  title?: string
}

function reducer(state: TState, action: TAction) {
  switch (action.type) {
    case 'loadTasksError':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case 'loadTasksSuccess':
      return {
        ...state,
        loading: false,
        tasks: action.tasks as TTaskItemDTM[],
      };
    case 'addTask':
      return {
        ...state,
        tasks: [...state.tasks, {
          _id: action.taskId,
          title: action.title,
          completed: false,
        }],
        selectedId: null,
        inputValue: '',
      };
    case 'deleteTask':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.taskId),
      };
    case 'updateTask':
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task._id === action.taskId) {
            const actionCompleted = action.completed === undefined
              ? task.completed : action.completed;
            return {
              ...task,
              title: action.title || task.title,
              completed: (actionCompleted !== task.completed) ? actionCompleted : task.completed,
            };
          }
          return task;
        }),
        selectedId: null,
        inputValue: '',
      };
    case 'updateInputValue':
      return {
        ...state,
        inputValue: action.value,
      };
    case 'selectTask':
      return {
        ...state,
        selectedId: action.taskId,
        inputValue: action.title || '',
      };
    default:
      return state;
  }
}

async function createTask(title: string) {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  return res;
}

async function updateTask(taskId: string, taskData: { title?: string, completed?: boolean }) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...taskData,
    }),
  });
  return res;
}

async function deleteTask(taskId: string) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
  return res;
}

export default function TaskManager() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dialogEl = useRef<HTMLDialogElement>(null);

  const {
    loading, error, tasks, inputValue, selectedId,
  } = state;

  useEffect(() => {
    let ready = true;

    async function fetchTasks() {
      try {
        const res = await fetch('/api/tasks');

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const json = await res.json();

        if (ready) {
          dispatch({
            type: 'loadTasksSuccess',
            tasks: json,
          });
        }
      } catch (ex) {
        if (ready && ex instanceof Error) {
          dispatch({
            type: 'loadTasksError',
            error: ex.message,
          });
        }
      }
    }

    fetchTasks();

    return () => { ready = false; };
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div className={styles.TaskManager}>

      <Button
        title="Add New"
        onClick={() => {
          dialogEl.current?.showModal();
        }}
      >
        Add New
      </Button>

      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li key={task._id}>

            <div className={styles.taskItem}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={async () => {
                  const res = await updateTask(task._id, { completed: !task.completed });

                  if (res.ok) {
                    dispatch({
                      type: 'updateTask',
                      taskId: task._id,
                      completed: !task.completed,
                    });
                  }
                }}
              />
              {task.title}
              <div>
                <Button
                  title="Edit Task"
                  onClick={() => {
                    dispatch({ type: 'selectTask', taskId: task._id, title: task.title });
                    dialogEl.current?.showModal();
                  }}
                >
                  <EditIcon />
                </Button>

                <Button
                  title="Delete Task"
                  onClick={async () => {
                    // delete task
                    const res = await deleteTask(task._id);

                    if (res.ok) {
                      dispatch({ type: 'deleteTask', taskId: task._id });
                    }
                  }}
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <li style={{ textAlign: 'center' }}>
            {'Click "Add New" to start'}
          </li>
        )}
      </ul>

      <dialog ref={dialogEl} className={styles.newTaskDialog}>
        <form
          method="dialog"
          className={styles.dialogForm}
          onSubmit={async (evt) => {
            evt.preventDefault();

            if (inputValue.length > 0) {
              if (!selectedId) {
                // create new task
                const res = await createTask(inputValue);

                if (res.ok) {
                  const result = await res.json();
                  dispatch({
                    type: 'addTask',
                    taskId: result._id,
                    title: result.title,
                  });
                }
              } else {
                // update existing task
                const res = await updateTask(selectedId, { title: inputValue });

                if (res.ok) {
                  const result = await res.json();
                  dispatch({
                    type: 'updateTask',
                    taskId: result._id,
                    title: result.title,
                  });
                }
              }

              dialogEl.current?.close();
            }
          }}
        >
          <h2>{!selectedId ? 'New Task' : 'Edit Task'}</h2>

          <label htmlFor="new-task-input">
            Title
            <input
              type="text"
              maxLength={50}
              id="new-task-input"
              value={inputValue}
              onChange={(evt) => {
                const { value } = evt.target;
                dispatch({
                  type: 'updateInputValue',
                  value,
                });
              }}
            />
          </label>

          <div className={styles.dialogFormButtons}>
            <Button
              id="cancel"
              type="reset"
              title="Close Dialog"
              onClick={() => {
                dispatch({
                  type: 'updateInputValue',
                  value: '',
                });
                dispatch({
                  type: 'selectTask',
                  taskId: null,
                });
                dialogEl.current?.close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" title="Submit changes">Confirm</Button>
          </div>
        </form>
      </dialog>

    </div>
  );
}
