let calendar = document.querySelector('.calendar');

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0);
}
// 4의 배수가 되는 해는 윤년, 100의 배수가 되는 해는 제외, 100의 배수이지만 400의 배수이면 윤년에 포함

getFebDay = (year) => {
    return isLeapYear(year) ? 29 : 28;
}

generateCalendar = (month, year) => {
    let calendar_days = calendar.querySelector('.calendar-days');
    let calendar_header_year = calendar.querySelector('#year');

    let days_of_month = [31, getFebDay(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    calendar_days.innerHTML = '';

    let currDate = new Date();
    if (month == null) month = currDate.getMonth();
    if (!year) year = currDate.getFullYear();

    let curr_month = `${month_names[month]}`;
    month_picker.innerHTML = curr_month;
    calendar_header_year.innerHTML = year;

    let first_day = new Date(year, month, 1);

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        /*2021년 8월을 기준으로 days_of_month[month]는 31, first_day.getDay()는 0, 즉 i <=30
        2021년 8월은 31일이 있고 i는 0부터 시작해서 30까지 총 31개 이므로 
        각 연도와 월에 맞는 일의 갯수를 구할 수 있음*/
        let day = document.createElement('div');
        if (i >= first_day.getDay()) {
            //모든 일들에 대하여
            day.classList.add('calendar-day-hover');
            day.innerHTML = i - first_day.getDay() + 1; //1부터 31일까지 입력됨
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear()
                && month === currDate.getMonth()) {
                //만일 현재 날짜와 같다면
                day.classList.add('curr-date')
            }
        }
        calendar_days.appendChild(day);
    }
}

let month_list = calendar.querySelector('.month-list');

month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div data-month="${index}">${e}</div>`;
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show');
        curr_month.value = index;
        generateCalendar(curr_month.value, curr_year.value);
    }
    month_list.appendChild(month);
})

let month_picker = calendar.querySelector('#month-picker');

month_picker.onclick = () => {
    month_list.classList.add('show');
}

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value;
    generateCalendar(curr_month.value, curr_year.value);
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value;
    generateCalendar(curr_month.value, curr_year.value);
}

let currDate = new Date();

let curr_month = { value: currDate.getMonth() };
let curr_year = { value: currDate.getFullYear() };

generateCalendar(curr_month.value, curr_year.value);

let todo_today = document.querySelector('.todo-today');
let todo_days = document.querySelector('.todo-days');
let todo_week_day = document.querySelector('.todo-week-day');
let first_day = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
let last_day = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0);
const month_today = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let days_of_month = [31, getFebDay(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

todo_today.innerHTML = `${month_names[currDate.getMonth()]} ${currDate.getFullYear()}`;

for (let i = 0; i < 7; i++) {
    let todo_day = document.createElement('div');
    if (i + currDate.getDate() <= last_day.getDate()) {
    todo_day.innerHTML = i + currDate.getDate();
    } else if (i + currDate.getDate() > last_day.getDate()) {
    todo_day.innerHTML = i + currDate.getDate() - last_day.getDate();
    }
    todo_days.appendChild(todo_day);

    let todo_week = document.createElement('div');
    if (currDate.getDay() + i > 6) {
    todo_week.innerHTML = `${month_today[currDate.getDay() + i - 7]}`;
    } else {
    todo_week.innerHTML = `${month_today[currDate.getDay() + i]}`;
    }
    todo_week_day.appendChild(todo_week);

    todo_day.onclick = () => todo_day.classList.toggle('todo-day-click');
}

const inputBox = document.querySelector('.todo-input input');
const addBtn = document.querySelector('.todo-input button');
const todoList = document.querySelector('.todo-list');
const deleteAllBtn = document.querySelector('.todo-footer button');

inputBox.onkeyup = () => {
    let userData = inputBox.value;
    if (userData.trim() != 0) {
        addBtn.classList.add('active');
    } else {
        addBtn.classList.remove('active');
    }
}

showTasks();

addBtn.onclick = () => {
    let getLocalStorage = localStorage.getItem("New Todo");
    if (getLocalStorage == null) {
        listArr = [];
    } else {
        listArr = JSON.parse(getLocalStorage);
    }

    let userData = inputBox.value;
    listArr.push(userData);
    localStorage.setItem("New Todo", JSON.stringify(listArr));

    showTasks();
}

function showTasks() {
    let getLocalStorage = localStorage.getItem("New Todo");
    if (getLocalStorage == null) {
        listArr = [];
    } else {
        listArr = JSON.parse(getLocalStorage);
    }

    const pendingNumb = document.querySelector('.pendingNumb');
    pendingNumb.textContent = listArr.length;
    /*innerText는 불필요한 공백을 제거하고 텍스트로 반환하지만
    textContent는 모든 텍스트를 그대로 가져옴*/

    if (listArr.length > 0) {
        deleteAllBtn.classList.add('active');
    } else {
        deleteAllBtn.classList.remove('active');
    }

    let newLiTag = '';
    listArr.forEach((element, index) => {
        newLiTag += `<li>
                        <input type="checkbox"><label class="label">${element}</label>
                        <input type="text" value="${element}">
                        <div class="todo-list-icon">
                            <span class="edit" onclick="editTask(${index})"><i class="ri-edit-2-line"></i></span>
                            <span onclick="deleteTask(${index})"><i class="ri-delete-bin-line"></i></span>
                        </div>
                    </li>`;
    });

    todoList.innerHTML = newLiTag;
    inputBox.value = '';
}

function deleteTask(index) {
    let getLocalStorage = localStorage.getItem("New Todo");
    listArr = JSON.parse(getLocalStorage);
    listArr.splice(index, 1);

    localStorage.setItem("New Todo", JSON.stringify(listArr));
    showTasks();
}

deleteAllBtn.onclick = () => {
    listArr = [];
    localStorage.setItem("New Todo", JSON.stringify(listArr));
    showTasks();
}

function editTask(index) {
    let edit = document.querySelectorAll('.edit')[index];
    let listItem = edit.parentNode.parentNode; //li
    
    let editInput = listItem.querySelector('input[type=text]');
    let label = listItem.querySelector('label');
    let containsClass = listItem.classList.contains('editMode');

    if(containsClass) {
        label.innerText = editInput.value;
    } else {
        editInput.value = label.innerText;
    }
    
    listItem.classList.toggle('editMode');
}

document.querySelector('.dark-mode-switch').onclick = () => {
    document.querySelector('body').classList.toggle('dark');
    document.querySelector('body').classList.toggle('light');
    if (document.querySelector('body').classList.contains('dark')) {
        document.querySelector('.toggle span').textContent = 'Light Mode';
    } else if (document.querySelector('body').classList.contains('light')) {
        document.querySelector('.toggle span').textContent = 'Dark Mode';
    }
}
