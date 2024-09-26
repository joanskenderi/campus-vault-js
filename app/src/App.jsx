import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Loader from './components/Loader';
import { routes } from './routes';
import store from './store/store';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Provider store={store}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Provider>
  );
};

export default App;
