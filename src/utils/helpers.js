export const calculateCompletion = (progressData, completedTasks) => {
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

  return Math.round((completedValue / totalPossibleValue) * 100 || 0); // Prevent division by zero - if no tasks with values were given
};

export const groupCompleted = (tasks) => {
  if (tasks) {
    const totalPossibleValue = tasks.reduce(
      (taskCount, task) => taskCount + task.checked,
      0
    );
    return tasks.length === totalPossibleValue;
  }
};
