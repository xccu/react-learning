import { useRoutes } from 'react-router-dom'
import ComponentsExample from '../components/ComponentsExample'
import JsxExample from '../components/JsxExample'
import StylesExample from '../components/StylesExample'
import DisplayDataExample from '../components/DisplayDataExample'
import ConditionalExample from '../components/ConditionalExample'
import ListsExample from '../components/ListsExample'
import EventsExample from '../components/EventsExample'
import StateExample from '../components/StateExample'
import HooksExample from '../components/HooksExample'
import SharingDataExample from '../components/SharingDataExample'

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
    { path: 'sharing-data', element: <SharingDataExample /> },
  ])
}