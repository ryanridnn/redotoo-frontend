import { useEffect, useState } from "react";
import axios from "axios";
import Theme from "./styles/Theme";
import Routers from "./router";
import TodoProvider from "./store";

function App() {
  return (
    <Theme>
      <TodoProvider>
        <Routers></Routers>
      </TodoProvider>
    </Theme>
  );
}

export default App;
