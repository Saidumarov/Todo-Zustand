import axios from "axios";
import create from "zustand";

const useTodoStore = create((set) => ({
  todos: [],
  loading: true,
  error: "",
  getTodo: async () => {
    set({ loading: true, error: "" });
    try {
      const response = await axios.get("http://localhost:3000/todos");
      set({ todos: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  addTodo: async (todo) => {
    try {
      const response = await axios.post("http://localhost:3000/todos", todo);
      set((state) => ({ todos: [...state.todos, response.data] }));
      return response.data;
    } catch (error) {
      console.error("Todo qo‘shishda xatolik:", error);
    }
  },
  deleteTodo: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`);
      set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) }));
    } catch (error) {
      console.error("Todo o‘chirishda xatolik:", error);
    }
  },
  updateTodo: async (id, updatedTodo) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/todos/${id}`,
        updatedTodo
      );
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? response.data : todo
        ),
      }));
      return response.data;
    } catch (error) {
      console.error("Todo yangilashda xatolik:", error);
    }
  },
}));

export default useTodoStore;
