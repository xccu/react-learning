import { useRoutes } from 'react-router-dom'
import ComponentsExample from './examples/ComponentsExample'
import JsxExample from './examples/JsxExample'
import StylesExample from './examples/StylesExample'
import DisplayDataExample from './examples/DisplayDataExample'
import ConditionalExample from './examples/ConditionalExample'
import ListsExample from './examples/ListsExample'
import EventsExample from './examples/EventsExample'
import StateExample from './examples/StateExample'
import HooksExample from './examples/HooksExample'
import HookComparisonExample from './examples/HookComparisonExample'
import SharingDataExample from './examples/SharingDataExample'

export function DocsRoutes() {
  return useRoutes([
    { path: 'components', element: <ComponentsExample /> },
    { path: 'jsx', element: <JsxExample /> },
    { path: 'styles', element: <StylesExample /> },
    { path: 'display-data', element: <DisplayDataExample /> },
    { path: 'conditional', element: <ConditionalExample /> },
    { path: 'lists', element: <ListsExample /> },
    { path: 'events', element: <EventsExample /> },
    { path: 'state', element: <StateExample /> },
    { path: 'hooks', element: <HooksExample /> },
    { path: 'hook-comparison', element: <HookComparisonExample /> },
    { path: 'sharing-data', element: <SharingDataExample /> },
  ])
}