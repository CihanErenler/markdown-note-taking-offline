import { v4 as uuidv4 } from "uuid";

export const defaultState = {
	totalAmount: 1,
	files: {
		id: "1",
		name: "Folders",
		items: {
			id: uuidv4(),
			name: "New Folder",
			items: [
				{
					id: uuidv4(),
					name: "New File",
					tags: [],
				},
			],
		},
	},
	tags: [
		{ id: "1", name: "Blue", color: "#2676ff", items: [] },
		{ id: "2", name: "Green", color: "green", items: [] },
		{ id: "3", name: "Grey", color: "grey", items: [] },
		{ id: "4", name: "Important", color: "red", items: [] },
		{ id: "5", name: "Orange", color: "orange", items: [] },
		{ id: "6", name: "Purple", color: "purple", items: [] },
		{ id: "7", name: "Work", color: "yellow", items: [] },
		{ id: "8", name: "Development", color: "dodgerblue", items: [] },
	],
};

export const defaultCode = {
	code: "",
	tags: [],
};
