import { useContext } from 'react';
import { TimesheetContext, TimesheetProvider, ThemeProvider } from './context/Provider';
import { useTheme } from './context/ThemeContext';
import { TimesheetForm } from './components/TimesheetForm';
import { TimesheetList } from './components/TimesheetList';
import { TimesheetFilters } from './components/TimesheetFilters';
import { TimesheetSummary } from './components/TimesheetSummary';
import { Navbar } from './components/Navbar';
import { filterTimesheets } from './utils/helpers';
import styles from './styles/App.module.css';

const AppContent = () => {
  const { state, addTimesheet, updateTimesheet, deleteTimesheet, setEditingId, setView, setFilters, resetFilters } = useContext(TimesheetContext);
  const { theme } = useTheme();

  const filteredTimesheets = filterTimesheets(state.timesheets, state.filters);

  const handleFormSubmit = (timesheet) => {
    if (timesheet.id && state.timesheets.find(ts => ts.id === timesheet.id)) {
      updateTimesheet(timesheet);
    } else {
      addTimesheet(timesheet);
    }
    setEditingId(null);
    setView('list');
  };

  const handleEdit = (timesheet) => {
    setEditingId(timesheet.id);
    setView('form');
  };

  const handleDelete = (id) => {
    deleteTimesheet(id);
  };

  return (
    <div className={`${styles.app} ${theme === 'dark' ? styles.dark : ''}`}>
      <Navbar />
      <main className={styles.main}>
        {state.currentView === 'form' && (
          <div className={styles.formSection}>
            <TimesheetForm
              editingTimesheet={state.editingId ? state.timesheets.find(ts => ts.id === state.editingId) : null}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setEditingId(null);
                setView('list');
              }}
            />
          </div>
        )}

        {state.currentView === 'list' && (
          <div className={styles.listSection}>
            <TimesheetFilters
              filters={state.filters}
              onFilterChange={(filters) => setFilters(filters)}
              onReset={resetFilters}
              timesheets={state.timesheets}
              resultCount={filteredTimesheets.length}
            />
            <TimesheetList
              timesheets={filteredTimesheets}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {state.currentView === 'summary' && (
          <div className={styles.summarySection}>
            <TimesheetSummary timesheets={state.timesheets} />
          </div>
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <TimesheetProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </TimesheetProvider>
  );
};

export default App;