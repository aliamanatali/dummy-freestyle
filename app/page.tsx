"use client";

import { useState, useEffect } from "react";
import { ListTodo } from "lucide-react";
import TodoInput from "@/components/todo-input";
import TodoList from "@/components/todo-list";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const editTodo = (id: string, text: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ListTodo className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              My Tasks
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Stay organized and productive
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <TodoInput onAddTodo={addTodo} />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm text-gray-600">
            {todos.length} {todos.length === 1 ? "task" : "tasks"}
          </p>
          {todos.length > 0 && (
            <p className="text-sm text-gray-600">
              {todos.filter((t) => t.completed).length} completed
            </p>
          )}
        </div>

        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
}
