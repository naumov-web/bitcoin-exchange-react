import { Container, Typography } from "@material-ui/core";
import IndexPage from "./components/pages/IndexPage";

import "./styles/main.sass";

function App() {
  return (
    <div className="App">
      <Container maxWidth="lg">
        <Typography variant="h4">Bitcoin - Курсы относительно валют</Typography>
        <IndexPage />
      </Container>
    </div>
  );
}

export default App;
