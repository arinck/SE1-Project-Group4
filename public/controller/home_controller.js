export function onSubmitCalcForm(e) {
    e.preventDefault();
    const nStr = e.target.number.value;
    const n = parseInt(nStr);
    const ul = document.getElementById('display');
    const eqString = `
    ${n} x ${n} = ${n * n}
    `;
    const li = document.createElement('li');
    li.textContent = eqString;
    ul.appendChild(li);
    e.target.number.value = ''; //clear input field
    
}