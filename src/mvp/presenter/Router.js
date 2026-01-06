
export default class Router {
  views = null;
  container = null;
  
  constructor(container, views) {
    this.container = container;
    this.views = views;
  }

  start() {
    addEventListener('hashchange', this.changeView.bind(this));
    this.changeView();
  }

  changeView() {
    const hash = window.location.hash.substring(1) || 'kalendarz';
    
    if (!hash || hash === 'kalendarz') {
      window.location.hash = '#kalendarz';
      if (!hash) return;
    }
    
    const view = this.views[hash];
    if (view) {view.render(this.container);}
  }
}
