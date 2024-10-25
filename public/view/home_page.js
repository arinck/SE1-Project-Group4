import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./protected_view.js";
import { onSubmitCreateForm, onClickExpandButton, onKeyDownNewItemInput, onMouseOverItem, onMouseOutItem, onKeyDownUpdateItem } from "../controller/home_controller.js";
import { getToDoTitleList } from "../controller/firestore_controller.js";
import { DEV } from "../model/constants.js";


export async function homePageView() {
    if (!currentUser) {
        root.innerHTML = await protectedView()
        return;
    }

    const response = await fetch('/view/templates/home_page_template.html',
        { cache: 'no-store' }
    );
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4');
    const form = divWrapper.querySelector('form');
    form.onsubmit = onSubmitCreateForm;

    root.innerHTML = '';
    root.appendChild(divWrapper);

    // read all existing titles
    let toDoTitlelList = '';
    try {
        toDoTitlelList = await getToDoTitleList(currentUser.uid);
    } catch (e) {
        if (DEV) console.log('failed to get title list', e);
        alert('Failed to get title list: ' + JSON.stringify(e));
        return;
    }

    const container = divWrapper.querySelector('#todo-container');
    toDoTitlelList.forEach(title => {
        container.appendChild(buildCard(title));
    });

}

export function buildCard(todoTitle) {
    const div = document.createElement('div');
    div.classList.add('card', 'd-inline-block');
    div.style = "width: 25rem;";
    div.innerHTML = `
        <div id="${todoTitle.docId}" class="card-body">
            <button class="btn btn-outline-primary">+</button>
            <span class="fs-3 card-title">${todoTitle.title}</span>
        </div>
    `;

    const expandButton = div.querySelector('button');
    expandButton.onclick = onClickExpandButton;
    return div;
}

export function buildCardText(titleDocId, itemList) {
    const p = document.createElement('p');
    p.classList.add('card-text', 'd-block');
    const ul = document.createElement('ul');
    p.appendChild(ul);

    // add all existing items
    if (itemList.length != 0) {
        itemList.forEach(item => {
            ul.appendChild(createToDoItemElement(item));
        })
    }

    const newItemInput = document.createElement('input');
    newItemInput.size = "40";
    newItemInput.id = "input" + titleDocId;
    newItemInput.placeholder = "Enter an item";
    newItemInput.onkeydown = function (e) {
        onKeyDownNewItemInput(e, titleDocId);
    }
    p.appendChild(newItemInput);

    return p;
}

export function createToDoItemElement(item) {
    const li = document.createElement('li');
    li.id = item.docId;
    li.innerHTML = `
        <span class="d-block">${item.content}</span>
        <input class="d-none" type="text" value="${item.content}">
    `;
    li.onmouseover = onMouseOverItem;
    li.onmouseout = onMouseOutItem;
    const input = li.querySelector('input');
    input.onkeydown = onKeyDownUpdateItem;
    return li;
}