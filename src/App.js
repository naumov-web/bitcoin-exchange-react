import { Container, Typography } from "@material-ui/core";
import { QueryClient, QueryClientProvider } from "react-query";
import IndexPage from "./components/pages/IndexPage";

import "./styles/main.sass";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Container maxWidth="lg">
          <Typography variant="h4">
            Bitcoin - Курсы относительно валют
          </Typography>
          <IndexPage />
        </Container>
      </div>
    </QueryClientProvider>
  );
}

export default App;
