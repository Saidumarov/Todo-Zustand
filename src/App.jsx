import React from "react";
import TodoList from "./components/TodoList";
import { Container } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
function App() {
  return (
    <ChakraProvider>
      <Container maxWidth={"900px"} margin={"auto"}>
        <TodoList />
      </Container>
    </ChakraProvider>
  );
}

export default App;
