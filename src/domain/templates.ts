export interface NoteTemplate {
  id: string;
  label: string;
  title: (date: Date) => string;
  content: string;
}

export const localDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const templates: NoteTemplate[] = [
  {
    id: "daily",
    label: "Daily note",
    title: (date) => `Daily note ${localDate(date)}`,
    content: "## Plan for today\n\n- [ ] \n\n## Notes\n\n",
  },
  {
    id: "meeting",
    label: "Meeting notes",
    title: (date) => `Meeting ${localDate(date)}`,
    content:
      "**Attendees:** \n\n## Agenda\n\n- \n\n## Decisions\n\n- \n\n## Action items\n\n- [ ] \n",
  },
  {
    id: "todo",
    label: "To-do list",
    title: () => "To-do list",
    content: "## To do\n\n- [ ] \n\n## Done\n\n- [x] ",
  },
];
