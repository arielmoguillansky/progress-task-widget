import React, { useState, useEffect } from "react";
import icon from "./icons/icon.svg";
import completed from "./icons/icon-check.svg";
import arrow from "./icons/arrow.svg";
import "./TaskProgressWidget.css";
import { CheckboxComponent } from "./components/CheckboxComponent";
import { calculateCompletion, groupCompleted } from "./utils/helpers";

const TaskProgressWidget = () => {
  const [completedTasks, setCompletedTasks] = useState({});
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState([]);

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
        const parsedData = data.map((group) => ({
          ...group,
          completed: groupCompleted(group.tasks),
        }));
        groupCompleted();
        setCompletedTasks(initialCompletedTasks);
        setProgressData(parsedData);
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

    setProgressData((prevGroup) => {
      const updatedGroup = prevGroup.map((g) => {
        if (g.name === groupName) {
          // Create a new array of tasks with the updated checked value
          const updatedTasks = g.tasks.map((task, i) => ({
            ...task,
            checked: i === taskIndex ? !task.checked : task.checked,
          }));

          // Use the updatedTasks array to calculate the 'completed' property
          const completed = groupCompleted(updatedTasks);

          return { ...g, tasks: updatedTasks, completed };
        }
        return g;
      });

      return updatedGroup;
    });
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prevGroups) =>
      prevGroups.includes(groupName)
        ? prevGroups.filter((group) => group !== groupName)
        : [...prevGroups, groupName]
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const progressBarStyle = {
    height: "100%",
    width: `${calculateCompletion(progressData, completedTasks)}%`,
    backgroundColor: "#00B797",
    borderRadius: 24,
    textAlign: "right",
    padding: "2px 16px",
  };

  return (
    <div>
      <div className="header">
        <h2>Lodgify Grouped Tasks</h2>
        <div className="progress-bar-wrapper">
          <div style={progressBarStyle} className="progress-bar">
            <span>{calculateCompletion(progressData, completedTasks)}%</span>
          </div>
        </div>
      </div>

      <div className="accordion">
        {progressData.map((group) => (
          <div className="accordion-row" key={group.name}>
            <div
              className="group-heading"
              onClick={() => toggleGroup(group.name)}
            >
              {groupCompleted(group.tasks) ? (
                <div className="heading-title">
                  <img src={completed} alt="group icon" />
                  <h3 style={{ color: "#00B797" }}>{group.name}</h3>
                </div>
              ) : (
                <div className="heading-title">
                  <img src={icon} alt="group icon" />
                  <h3>{group.name}</h3>
                </div>
              )}
              <div
                className={`heading-action ${
                  expandedGroups.includes(group.name) ? "active" : ""
                }`}
              >
                {expandedGroups.includes(group.name) ? "Hide" : "Show"}
                <img src={arrow} alt="arrow icon" />
              </div>
            </div>

            {expandedGroups.includes(group.name) && (
              <ul>
                {group.tasks.map((task, index) => (
                  <li key={index}>
                    <label htmlFor={`${group.name}-${index}`}>
                      <CheckboxComponent
                        checked={completedTasks[group.name][index]}
                      />
                      <input
                        type="checkbox"
                        id={`${group.name}-${index}`}
                        checked={completedTasks[group.name][index]}
                        onChange={() => handleTaskToggle(group.name, index)}
                      />
                      <span>{task.description}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskProgressWidget;
