import React, { useEffect, useState } from "react";
import "./index.scss";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Select,
  Card,
  Flex,
  ButtonGroup,
  Text,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import useTodoStore from "../store/index";
import axios from "axios";
function TodoList() {
  const { todos, addTodo, deleteTodo, updateTodo, getTodo, loading } =
    useTodoStore();
  const [editText, setEditText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [completed, setCompleted] = useState(false);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [btnActive, setbtnActive] = useState(null);
  const [editId, seteditId] = useState(null);

  const add = async (text) => {
    const todo = {
      text: text,
      completed: completed,
    };
    addTodo(todo);
    onClose();
    setEditText("");
    setCompleted(false);
    toast({
      title: `Added successfully`,
      status: "success",
      isClosable: true,
    });
  };

  const toggleTodo = async (id) => {
    setbtnActive(false);
    onOpen();
    const todo = await axios.get(`http://localhost:3000/todos/${id}`);
    setEditText(todo.data.text);
    setCompleted(todo.data.completed);
    seteditId(id);
  };

  const update = async () => {
    const todo = {
      text: editText,
      completed: completed,
    };
    updateTodo(editId, todo);
    onClose();
    setEditText("");
    setCompleted(false);
    toast({
      title: `Updated successfully`,
      status: "warning",
      isClosable: true,
    });
  };

  const changeCompleted = (value) => {
    if (value == "true") {
      setCompleted(true);
    } else if (value == "false") {
      setCompleted(false);
    }
  };

  const hendelCheck = (el) => {
    if (el.completed == true) {
      const todo = {
        text: el.text,
        completed: false,
      };
      updateTodo(el.id, todo);
    } else if (el.completed === false) {
      const todo = {
        text: el.text,
        completed: true,
      };
      updateTodo(el?.id, todo);
    }
  };

  const deleteBtn = (id) => {
    deleteTodo(id);
    toast({
      title: `Deleted successfully`,
      status: "error",
      isClosable: true,
    });
  };

  useEffect(() => {
    getTodo();
  }, []);

  return (
    <div className="todo-container">
      <>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={() => (onClose(), setCompleted(false), setEditText(""))}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Todo</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  ref={initialRef}
                  placeholder="Title"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Status</FormLabel>
                <Select
                  value={completed}
                  onChange={(e) => changeCompleted(e.target.value)}
                >
                  <option value={false}>Incomplete</option>
                  <option value={true}>Completed</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {btnActive ? (
                <Button onClick={() => add(editText)} colorScheme="blue" mr={3}>
                  Save
                </Button>
              ) : (
                <Button onClick={update} colorScheme="blue" mr={3}>
                  Update
                </Button>
              )}
              <Button
                onClick={() => (
                  onClose(), setCompleted(false), setEditText("")
                )}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <div className="header">
        <Heading>TODO LIST</Heading>
        <Button
          width={"120px"}
          height={"45px"}
          colorScheme="teal"
          variant="outline"
          onClick={() => (onOpen(), setbtnActive(true))}
        >
          Add
        </Button>
      </div>
      <div>
        <Card marginTop={"50px"} padding={"20px"} bg={"rgb(237, 235, 245)"}>
          {todos?.length > 0 ? (
            todos.map((todo, i) => (
              <div key={i}>
                <Card
                  marginTop={"20px"}
                  bg={"rgb(255, 255, 255)"}
                  padding={"20px"}
                >
                  <Flex
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        size="lg"
                        colorScheme="green"
                        defaultChecked
                        isChecked={todo.completed}
                        onChange={() => hendelCheck(todo)}
                      ></Checkbox>
                      {todo.completed ? (
                        <Text>{todo?.text}</Text>
                      ) : (
                        <s>
                          <Text>{todo?.text}</Text>
                        </s>
                      )}
                    </div>
                    <ButtonGroup>
                      <Button
                        colorScheme="red"
                        onClick={() => deleteBtn(todo?.id)}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        colorScheme="orange"
                        onClick={() => toggleTodo(todo?.id)}
                      >
                        <EditIcon />
                      </Button>
                    </ButtonGroup>
                  </Flex>
                </Card>
              </div>
            ))
          ) : (
            <Heading textAlign={"center"} fontSize={"22px"}>
              No Todos
            </Heading>
          )}
        </Card>
      </div>
    </div>
  );
}

export default TodoList;
