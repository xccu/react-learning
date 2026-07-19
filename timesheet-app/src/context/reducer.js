const TIMESHEET_STORAGE_KEY = 'timesheet_data';

const initialState = {
  timesheets: [],
  filters: {
    dateRange: { start: '', end: '' },
    project: '',
    taskType: ''
  },
  editingId: null,
  currentView: 'list'
};

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(TIMESHEET_STORAGE_KEY);
    if (stored) {
      return { ...initialState, timesheets: JSON.parse(stored) };
    }
  } catch (e) {
    console.error('加载数据失败:', e);
  }
  return initialState;
};

const timesheetReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TIMESHEETS':
      return { ...state, timesheets: action.payload };

    case 'ADD_TIMESHEET':
      return {
        ...state,
        timesheets: [...state.timesheets, action.payload]
      };

    case 'UPDATE_TIMESHEET':
      return {
        ...state,
        timesheets: state.timesheets.map(ts =>
          ts.id === action.payload.id ? { ...action.payload, updatedAt: Date.now() } : ts
        )
      };

    case 'DELETE_TIMESHEET':
      return {
        ...state,
        timesheets: state.timesheets.filter(ts => ts.id !== action.payload)
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: { dateRange: { start: '', end: '' }, project: '', taskType: '' }
      };

    case 'SET_EDITING_ID':
      return { ...state, editingId: action.payload };

    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    default:
      return state;
  }
};

export { initialState, loadFromStorage, timesheetReducer };