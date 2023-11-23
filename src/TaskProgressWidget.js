import React, { useState, useEffect } from "react";

const TaskProgressWidget = () => {
  const [completedTasks, setCompletedTasks] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    fetch(
      "https://gist.githubusercontent.com/huvber/ba0d534f68e34f1be86d7fe7eff92c96/raw/98a91477905ea518222a6d88dd8b475328a632d3/mock-progress"
    )
      .then((response) => response.json())
      .then((data) => {
        // Initialize completedTasks state based on the fetched data
        const initialCompletedTasks = {};
        data.forEach((group) => {
          initialCompletedTasks[group.name] = group.tasks.map(
            (task) => task.checked || false
          );
        });
        setCompletedTasks(initialCompletedTasks);
        setProgressData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      });
  }, []);

  const handleTaskToggle = (groupName, taskIndex) => {
    // update the completedTasks state by calling the previous state and updating only the task of the group that was changed
    setCompletedTasks((prevTasks) => {
      // get all tasks linked to the group being updated
      const groupTasks = [...prevTasks[groupName]];
      // change value of task by its index
      groupTasks[taskIndex] = !groupTasks[taskIndex];

      return {
        ...prevTasks,
        [groupName]: groupTasks,
      };
    });
  };

  const calculateCompletion = () => {
    // sum up the values of all tasks across all groups
    const totalPossibleValue = progressData.reduce(
      (count, group) =>
        count +
        group.tasks.reduce((taskCount, task) => taskCount + task.value, 0),
      0
    );

    // sum up the values of checked tasks across all groups
    const completedValue = progressData.reduce(
      (count, group) =>
        count +
        group.tasks.reduce(
          (taskCount, task, index) =>
            completedTasks[group.name][index]
              ? taskCount + task.value
              : taskCount,
          0
        ),
      0
    );

    return (completedValue / totalPossibleValue) * 100 || 0; // Prevent division by zero - if no tasks with values were given
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profile Creation Progress</h2>
      <p>Completion: {calculateCompletion()}%</p>

      {progressData.map((group) => (
        <div key={group.name}>
          <h3>{group.name}</h3>
          <ul>
            {group.tasks.map((task, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`${group.name}-${index}`}
                  checked={completedTasks[group.name][index]}
                  onChange={() => handleTaskToggle(group.name, index)}
                />
                <label htmlFor={`${group.name}-${index}`}>
                  {task.description} - {task.value}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskProgressWidget;
