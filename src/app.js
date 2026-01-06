import Router from './mvp/presenter/Router.js';
import ReportPresenter from './mvp/presenter/ReportPresenter.js';
import { CalendarPresenter } from './mvp/presenter/CalendarPresenter.js';
import NavBar from './shared/components/nav-bar.js';
import AppContainer from './shared/components/app-container.js';
import { CalendarView } from './mvp/view/CalendarView.js';
import ReportView from './mvp/view/ReportView.js';
import ReportService from './mvp/model/services/ReportService.js';
import { CalendarService } from './mvp/model/services/CalendarService.js';
import ReportAdapter from './mvp/model/adapters/ReportAdapter.js';
import { CalendarAdapter } from './mvp/model/adapters/CalendarAdapter.js';
import Formatters from './mvp/model/utils/Formatters.js';

const appContainer = new AppContainer();

// Calendar MVP
const calendarService = new CalendarService();
const calendarAdapter = new CalendarAdapter();
const calendarView = new CalendarView();
const calendarPresenter = new CalendarPresenter(calendarView, calendarService, calendarAdapter);

function onCalendarRendered() {
    calendarPresenter.init();
}
calendarView.onRendered = onCalendarRendered;

function onCalendarEventClicked(event) {
    calendarPresenter.handleEventClick(event);
}
calendarView.onEventClicked = onCalendarEventClicked;

// Report MVP
const reportService = new ReportService();
const reportAdapter = new ReportAdapter();
const formatters = new Formatters();
const reportView = new ReportView();
const reportPresenter = new ReportPresenter(reportView, reportService, reportAdapter, formatters);

function onReportRendered() {
    reportPresenter.init();
}
reportView.onRendered = onReportRendered;

const views = {
    'kalendarz': calendarView,
    'raporty': reportView
};

const router = new Router(appContainer, views);
const navBar = new NavBar();

document.body.appendChild(appContainer);
router.start();
document.body.appendChild(navBar);

