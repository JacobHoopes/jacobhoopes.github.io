const items = document.getElementsByClassName('item');

const focused = document.getElementById('focus');
let lastClicked = items[0];
for (let i=0; i<items.length; i++) {
    const focus = focused;
    items[i].addEventListener('click', () => {
        
        for (let j=0; j<items.length; j++) {
            items[j].classList.remove('clicked');
        }

        items[i].classList.add('clicked');
        const styles = window.getComputedStyle(items[i]);
        focus.style.backgroundImage = styles.getPropertyValue("background-image");
        focus.children[0].value = items[i].children[0].textContent;
        focus.children[1].value = items[i].children[1].textContent;
        lastClicked = items[i];

        let parent = window.getComputedStyle(items[i].parentElement);
        let parentParent = window.getComputedStyle(items[i].parentElement.parentElement);

        // focus.style.backgroundColor = styles.getPropertyValue("backgroundColor");
        if (items[i].parentElement.classList.contains("two-items")) {
            parent = window.getComputedStyle(items[i].parentElement.parentElement);
            parentParent = window.getComputedStyle(items[i].parentElement.parentElement.parentElement);
        }
        focus.parentElement.style.border = parent.getPropertyValue("border");
        focus.parentElement.style.backgroundColor = parent.getPropertyValue("background-color");

        focus.parentElement.parentElement.style.border = parentParent.getPropertyValue("border");
        focus.parentElement.parentElement.style.backgroundColor = parentParent.getPropertyValue("background-color");
        // focus.parentElement.parentElement.style.backgroundColor = parentParent.getPropertyValue("backgroundColor");  
    })

}

function titleInput() {
    lastClicked.children[0].textContent = focused.children[0].value;
}

function bodyInput() {
    lastClicked.children[1].textContent = focused.children[1].value;
}

function saveIt(){
    document.execCommand("SaveAs")
}


items[0].click();

