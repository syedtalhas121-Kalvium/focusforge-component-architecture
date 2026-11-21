import { useState } from "react";
import AddTaskInput from "../components/dashboard/AddTaskInput";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardLayout, {
  DashboardContent,
} from "../components/dashboard/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import TaskFilterBar from "../components/dashboard/TaskFilterBar";
import TaskList from "../components/dashboard/TaskList";
import tasks from "../data/tasks";

export default function DashboardPage() {
  const [taskList, setTaskList] = useState(tasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTaskList([
      ...taskList,
      {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: "medium",
        tag: "general",
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTaskList(taskList.filter((task) => task.id !== id));
  };

  const filtered = taskList
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const completedCount = taskList.filter((task) => task.completed).length;
  const totalCount = taskList.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardContent>
        <StatsRow
          totalCount={totalCount}
          completedCount={completedCount}
          remainingCount={totalCount - completedCount}
          progressPercent={progressPercent}
        />
        <AddTaskInput
          value={newTask}
          onChange={setNewTask}
          onAdd={addTask}
        />
        <TaskFilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <TaskList
          tasks={filtered}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </DashboardContent>
    </DashboardLayout>
  );
}
