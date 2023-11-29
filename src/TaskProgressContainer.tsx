import React, { useState, useEffect } from "react";
import TaskProgressWidget from "./TaskProgressWidget";
import { groupCompleted } from "./utils/helpers";

export interface Task {
  name: string;
  description: string;
  checked: boolean;
  value: number;
}

export interface Group {
  name: string;
  tasks: Task[];
  completed?: boolean;
}

const TaskProgressContainer: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<{
    [key: string]: boolean[];
  }>({});
  const [progressData, setProgressData] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    // Fetch data from the API
    fetch(
      "https://gist.githubusercontent.com/huvber/ba0d534f68e34f1be86d7fe7eff92c96/raw/98a91477905ea518222a6d88dd8b475328a632d3/mock-progress"
    )
      .then((response) => response.json())
      .then((data: Group[]) => {
        const initialCompletedTasks: { [key: string]: boolean[] } = {};
        data.forEach((group) => {
          initialCompletedTasks[group.name] = group.tasks.map(
            (task) => task.checked || false
          );
        });
        const parsedData: Group[] = data.map((group) => ({
          ...group,
          completed: groupCompleted(group.tasks),
        }));
        setCompletedTasks(initialCompletedTasks);
        setProgressData(parsedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      });
  }, []);

  const handleTaskToggle = (groupName: string, taskIndex: number) => {
    setCompletedTasks((prevTasks) => {
      const groupTasks = [...prevTasks[groupName]];
      groupTasks[taskIndex] = !groupTasks[taskIndex];
      return {
        ...prevTasks,
        [groupName]: groupTasks,
      };
    });

    setProgressData((prevGroup) => {
      const updatedGroup = prevGroup.map((g) => {
        if (g.name === groupName) {
          const updatedTasks = g.tasks.map((task, i) => ({
            ...task,
            checked: i === taskIndex ? !task.checked : task.checked,
          }));
          const completed = groupCompleted(updatedTasks);

          return { ...g, tasks: updatedTasks, completed };
        }
        return g;
      });

      return updatedGroup;
    });
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prevGroups) =>
      prevGroups.includes(groupName)
        ? prevGroups.filter((group) => group !== groupName)
        : [...prevGroups, groupName]
    );
  };

  return (
    <TaskProgressWidget
      loading={loading}
      progressData={progressData}
      completedTasks={completedTasks}
      expandedGroups={expandedGroups}
      handleTaskToggle={handleTaskToggle}
      toggleGroup={toggleGroup}
    />
  );
};

export default TaskProgressContainer;
