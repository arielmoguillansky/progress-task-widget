import React from "react";
import icon from "./icons/icon.svg";
import completedIcon from "./icons/icon-check.svg";
import arrow from "./icons/arrow.svg";
import "./TaskProgressWidget.css";
import { calculateCompletion, groupCompleted } from "./utils/helpers";
import { Group } from "./TaskProgressContainer";

interface GroupHeadingProps {
  groupName: string;
  completed: boolean | undefined;
  onClick: () => void;
  expanded: boolean;
}

interface TaskItemProps {
  id: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

interface CheckboxComponentProps {
  checked: boolean;
}

interface TaskProgressWidgetProps {
  loading: boolean;
  progressData: Group[];
  completedTasks: { [key: string]: boolean[] };
  expandedGroups: string[];
  handleTaskToggle: (groupName: string, taskIndex: number) => void;
  toggleGroup: (groupName: string) => void;
}

interface ProgressBarStyle {
  height: string;
  width: string;
  backgroundColor: string;
  borderRadius: number;
  textAlign: "right" | "center" | "left";
  padding: string;
}

const GroupHeading: React.FC<GroupHeadingProps> = ({
  groupName,
  completed,
  onClick,
  expanded,
}) => (
  <div className="group-heading" onClick={onClick}>
    <div className="heading-title">
      <img src={completed ? completedIcon : icon} alt="group icon" />
      <h3 style={{ color: completed ? "#00B797" : "" }}>{groupName}</h3>
    </div>
    <div className={`heading-action ${expanded ? "active" : ""}`}>
      {expanded ? "Hide" : "Show"}
      <img src={arrow} alt="arrow icon" />
    </div>
  </div>
);

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  description,
  checked,
  onChange,
}) => (
  <li key={id}>
    <label htmlFor={id}>
      <CheckboxComponent checked={checked} />
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <span>{description}</span>
    </label>
  </li>
);

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({ checked }) => {
  if (checked) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <rect width="16" height="16" rx="4" fill="#00B797" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.49574 10.1007L3.888 7.30201L3 8.24832L6.49574 12L13 4.94631L12.1182 4L6.49574 10.1007Z"
          fill="white"
        />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="15"
          height="15"
          rx="3.5"
          stroke="#999999"
        />
      </svg>
    );
  }
};

const TaskProgressWidget: React.FC<TaskProgressWidgetProps> = ({
  loading,
  progressData,
  completedTasks,
  expandedGroups,
  handleTaskToggle,
  toggleGroup,
}) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  const progressBarStyle: ProgressBarStyle = {
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
            <GroupHeading
              groupName={group.name}
              completed={groupCompleted(group.tasks)}
              onClick={() => toggleGroup(group.name)}
              expanded={expandedGroups.includes(group.name)}
            />

            {expandedGroups.includes(group.name) && (
              <ul>
                {group.tasks.map((task, index) => (
                  <TaskItem
                    key={index}
                    id={`${group.name}-${index}`}
                    description={task.description}
                    checked={completedTasks[group.name][index]}
                    onChange={() => handleTaskToggle(group.name, index)}
                  />
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
