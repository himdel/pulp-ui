import './app.scss';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import '@patternfly/patternfly/patternfly.scss';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UIVersion } from 'src/components';
import { AppContextProvider } from './app-context';
import { AppRoutes } from './app-routes';
import './darkmode';
import './l10n';
import { StandaloneLayout } from './layout';
import { UserContextProvider } from './user-context';

// App entrypoint

const searchParams = new URLSearchParams(window.location.search);
if (!window.location.pathname.startsWith(UI_BASE_PATH)) {
  // react-router v6 won't redirect to base path by default
  window.history.pushState(null, null, UI_BASE_PATH);
} else if (searchParams.has('lang') || searchParams.has('pseudolocalization')) {
  // delete lang after src/l10n uses it
  searchParams.delete('lang');
  searchParams.delete('pseudolocalization');
  window.history.pushState(
    null,
    null,
    window.location.pathname +
      (searchParams.toString() ? '?' + searchParams.toString() : ''),
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter basename={UI_BASE_PATH}>
      <I18nProvider i18n={i18n}>
        <UserContextProvider>
          <AppContextProvider>
            <StandaloneLayout>
              <AppRoutes />
            </StandaloneLayout>
            <UIVersion />
          </AppContextProvider>
        </UserContextProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
);
