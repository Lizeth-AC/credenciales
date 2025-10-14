import AppRouter from "./router/AppRouter";
import AppTheme from "./theme/AppTheme";
const anchoCaja = 200;
const App = () => {
    return (
      <AppTheme>
        <AppRouter/>
      </AppTheme>
    );
};

export default App;