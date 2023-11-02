// Список дел
const todoListItem = document.querySelector('.todo-list__item');
const input = document.getElementById('input');
let randomId = 0;

function createText(text) {
  const content = document.createElement('span');
  content.textContent = text;
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

function createCheckbox() {
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.name = 'todo-list__checkbox';
  return checkBox;
}

function createWrapper() {
  const div = document.createElement('div');
  div.className = 'todo-list__content';
  div.style.color = '#000000';
  div.setAttribute('data-id', randomId++);
  return div;
}

function createItem() {
  const item = document.createElement('div');
  item.className = 'todo-list__row';
  return item;
}

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

function removeTodo(id) {
  const todos = getTodo();
  const index = todos.findIndex((todo) => todo.id === id);
  console.log(index);
  todos.splice(index, 1);
  localStorage.setItem('todo', JSON.stringify(todos));
}

function updateTodo(todoObj, check) {
  const todos = getTodo();
  const index = todos.findIndex((todo) => todo.id === todoObj.id);
  console.log(index);
  const obj = todos[index];
  console.log(obj);
  obj.checkbox = check;

  localStorage.setItem('todo', JSON.stringify(todos));
}

function saveTodo(todoObj) {
  const todos = getTodo();
  if (!todos.some((todo) => todo.id === todoObj.id)) {
    todos.push(todoObj);
  }
  localStorage.setItem('todo', JSON.stringify(todos));
}

function removeItem(id) {
  const todo = todoListItem?.querySelector(`[data-id="${id}"]`);
  console.log(todo);
  const wrapper = todo?.closest('.todo-list__content');
  console.log(wrapper);
  wrapper?.remove();
  removeTodo(id);
}

function createRemoveButton(wrapper) {
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = 'Удалить';
  remove.addEventListener('click', () => {
    wrapper.remove();
    removeItem();

    const todos = document.querySelectorAll('.todo-list__content');
    if (todos.length <= 0) {
      toggleEmpty(true);
    }
  });
  return remove;
}

function createTodo(text) { // text = обычная строка ""
  const content = createText(text);
  const wrapper = createWrapper();
  const removeButton = createRemoveButton(wrapper);
  const checkbox = createCheckbox();
  const itemRow = createItem();
  const { id } = wrapper.dataset;
  const obj = {
    id: +id, text, checkbox: false,
  };
  saveTodo(obj);

  checkbox.addEventListener('change', (e) => {
    updateTodo(obj, check);
    content.classList.toggle('todo-list__item--done', e.checked);
  });

  wrapper.append(itemRow);
  itemRow.append(checkbox);
  itemRow.append(content);
  wrapper.append(removeButton);
  todoListItem.prepend(wrapper);

  toggleEmpty(false);
}

const loadTodo = () => {
  const load = getTodo();
  load.forEach((el) => {
    createTodo(el.text, el.checkbox);
  });
};
loadTodo();

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('todo-list__button')) {
    if (!input.value.trim()) {
      return;
    }
    createTodo(input.value); // передаем текст
    input.value = '';
  }
});

document.addEventListener('keydown', (e) => {
  if (!input.value.trim()) {
    return;
  }

  if (e.key === 'Enter') {
    createTodo(input.value);
    input.value = '';
  }
});
