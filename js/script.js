// Список дел
const todoListItem = document.querySelector('.todo-list__item');
const input = document.getElementById('input');

function getTodo() {
  try {
    const todoRaw = localStorage.getItem('todo');
    const todo = JSON.parse(todoRaw);
    return Array.isArray(todo) ? todo : [];
  } catch {
    console.warn('error while getting todo from LS');
    return [];
  }
}

function getLatestId() {
  const todos = getTodo();
  const ids = todos.map((todo) => todo.id);
  // console.log(ids);
  const maxCount = Math.max(...ids);
  // console.log(maxCount);
  return Number.isFinite(maxCount) ? maxCount + 1 : 0;
}
let randomId = getLatestId();

function createText(text, checked = false) {
  const content = document.createElement('span');
  content.textContent = text;
  if (checked) {
    content.classList.add('todo-list__item--done');
  }
  // content.classList.toggle('todo-list__item--done', checked);
  return content;
}
function toggleEmpty(visible) {
  const empty = document.querySelector('.todo-list__empty');
  if (visible) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
  }
}

function createCheckbox(checked = false) {
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.className = 'todo-list__checkbox';
  checkBox.checked = checked;
  return checkBox;
}

function createWrapper(id) {
  const div = document.createElement('div');
  div.className = 'todo-list__content';
  div.style.color = '#000000';
  div.setAttribute('data-id', id);
  return div;
}

function createItem() {
  const item = document.createElement('div');
  item.className = 'todo-list__row';
  return item;
}

function removeTodo(id) {
  const todos = getTodo();
  const index = todos.findIndex((todo) => todo.id === id);
  // console.log(index);
  todos.splice(index, 1);
  localStorage.setItem('todo', JSON.stringify(todos));
}

function updateTodo(data) {
  const todos = getTodo();
  const index = todos.findIndex((todo) => todo.id === data.id);
  // console.log(index);
  const obj = todos[index];
  // console.log(obj);
  obj.checkbox = data.checkbox;

  localStorage.setItem('todo', JSON.stringify(todos));
}

function saveTodo(todoObj) {
  const todos = getTodo();
  if (!todos.some((todo) => todo.id === todoObj.id)) {
    todos.push(todoObj);
  }
  localStorage.setItem('todo', JSON.stringify(todos));
}

function createRemoveButton(wrapper) {
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = 'Удалить';
  const { id } = wrapper.dataset;
  // console.log(id);
  remove.addEventListener('click', () => {
    wrapper.remove();
    removeTodo(+id);

    const todos = document.querySelectorAll('.todo-list__content');
    if (todos.length <= 0) {
      toggleEmpty(true);
    }
  });
  return remove;
}

function createTodo(data) { // text = обычная строка ""
  const id = data.id ?? randomId++;
  const content = createText(data.text, data.checkbox);
  const wrapper = createWrapper(id);
  const removeButton = createRemoveButton(wrapper);
  const checkbox = createCheckbox(data.checkbox);
  const itemRow = createItem();

  const obj = {
    id: +id, text: data.text, checkbox: false,
  };

  checkbox.addEventListener('change', (e) => {
    updateTodo({ ...obj, checkbox: e.target.checked });
    content.classList.toggle('todo-list__item--done', e.checked);
  });

  wrapper.append(itemRow);
  itemRow.append(checkbox);
  itemRow.append(content);
  wrapper.append(removeButton);
  todoListItem.prepend(wrapper);

  toggleEmpty(false);
  return obj;
}

const loadTodo = () => {
  const load = getTodo();
  load.forEach((el) => createTodo(el));
};
loadTodo();

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('todo-list__button')) {
    if (!input.value.trim()) {
      return;
    }
    const todo = createTodo({ text: input.value }); // передаем текст
    input.value = '';
    saveTodo(todo);
  }
});

document.addEventListener('keydown', (e) => {
  if (!input.value.trim()) {
    return;
  }

  if (e.key === 'Enter') {
    const todo = createTodo({ text: input.value });
    input.value = '';
    saveTodo(todo);
  }
});
