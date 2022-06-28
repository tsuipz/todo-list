const addTodoForm = document.querySelector('.add-todo');
const todoInput = document.getElementById('todo-input');
const todoAdd = document.querySelector('.todo-add');
const todoList = document.querySelector('.todo-list');

let items = {};

const onTypeInput = () => (todoAdd.disabled = todoInput.value.length === 0);

const onFormHandler = async (e) => {
	e.preventDefault();
	await addItem(todoInput.value, false);
	await getItems();
	todoInput.value = '';
	todoAdd.disabled = true;
};

const createTodoList = (name, checked, key = '') => {
	const listItem = createListItem(name, checked, key);
	todoList.append(listItem);
};

const createListItem = (name, checked, key = '') => {
	const li = document.createElement('li');
	li.id = key;

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.checked = checked;
	checkbox.addEventListener('click', onChecked.bind(null, checkbox));

	const p = document.createElement('p');
	p.textContent = name;

	const button = document.createElement('button');
	button.textContent = 'X';
	button.classList.add('todo-delete');
	button.addEventListener('click', onDeleteListItem.bind(null, button));

	li.append(checkbox, p, button);

	return li;
};

const onChecked = (checkbox) => {
	const value = checkbox.parentNode.querySelector('p').textContent;
	checkbox.checked = checkbox.checked === true;
	updateCheckedItem(items[value].key, checkbox.checked, value);
};

const onDeleteListItem = (button) => {
	const buttonParent = button.parentNode;
	if (buttonParent.id in items) {
		deleteItems(buttonParent.id);
		delete items[buttonParent.id];
	}
	buttonParent.remove();
};

const updateCheckedItem = async (key, checked, text) => {
	try {
		const response = await fetch(
			`https://todo-list-16d92-default-rtdb.firebaseio.com/todo-list/${key}.json`,
			{
				method: 'PUT',
				body: JSON.stringify({
					text,
					checked,
				}),
			}
		);
		if (!response.ok) {
			throw new Error('Something went wrong!');
		}
	} catch (error) {
		throw new Error('Something went wrong!');
	}
};

const addItem = async (text, checked) => {
	try {
		const response = await fetch(
			'https://todo-list-16d92-default-rtdb.firebaseio.com/todo-list.json',
			{
				method: 'POST',
				body: JSON.stringify({ text, checked }),
			}
		);
		if (!response.ok) throw new Error('Something went wrong!');
	} catch (error) {
		console.error(error);
	}
};

const getItems = async () => {
	try {
		const response = await fetch(
			'https://todo-list-16d92-default-rtdb.firebaseio.com/todo-list.json'
		);
		if (!response.ok) throw new Error('Something went wrong!');
		const data = await response.json();
		const key = Object.keys(data).pop();
		if (!(key in items)) {
			createTodoList(todoInput.value, false, key);
		}
		items = data;
	} catch (error) {
		console.error(error);
	}
};

const init = async () => {
	try {
		const response = await fetch(
			'https://todo-list-16d92-default-rtdb.firebaseio.com/todo-list.json'
		);
		if (!response.ok) throw new Error('Something went wrong!');
		const data = await response.json();
		items = data;
		for (const key in items) {
			const value = data[key];
			createTodoList(value.text, value.checked, key);
		}
	} catch (error) {
		console.error(error);
	}
};

const deleteItems = async (key) => {
	try {
		const response = await fetch(
			`https://todo-list-16d92-default-rtdb.firebaseio.com/todo-list/${key}.json`,
			{
				method: 'DELETE',
			}
		);
		if (!response.ok) throw new Error('Something went wrong!');
	} catch (error) {
		console.error(error);
	}
};

todoInput.addEventListener('input', onTypeInput);
addTodoForm.addEventListener('submit', onFormHandler);

init();
