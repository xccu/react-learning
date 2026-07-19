import { useReducer, useEffect, useState } from 'react';
import TimesheetContext from './TimesheetContext';
import ThemeContext from './ThemeContext';
import { timesheetReducer, loadFromStorage } from './reducer';

const TIMESHEET_STORAGE_KEY = 'timesheet_data';
const THEME_STORAGE_KEY = 'timesheet_theme';

export { TimesheetContext };

export const TimesheetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timesheetReducer, null, loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(TIMESHEET_STORAGE_KEY, JSON.stringify(state.timesheets));
    } catch (e) {
      console.error('保存数据失败:', e);
    }
  }, [state.timesheets]);

  const addTimesheet = (timesheet) => {
    dispatch({ type: 'ADD_TIMESHEET', payload: timesheet });
  };

  const updateTimesheet = (timesheet) => {
    dispatch({ type: 'UPDATE_TIMESHEET', payload: timesheet });
  };

  const deleteTimesheet = (id) => {
    dispatch({ type: 'DELETE_TIMESHEET', payload: id });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const setEditingId = (id) => {
    dispatch({ type: 'SET_EDITING_ID', payload: id });
  };

  const setView = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  return (
    <TimesheetContext.Provider value={{
      state,
      dispatch,
      addTimesheet,
      updateTimesheet,
      deleteTimesheet,
      setFilters,
      resetFilters,
      setEditingId,
      setView
    }}>
      {children}
    </TimesheetContext.Provider>
  );
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored || 'light';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};