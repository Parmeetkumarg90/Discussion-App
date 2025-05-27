// Local storage - 👍
// sorting in responses according to (like - dislike diff) optimize way - 👍
// search and highlight - 👍
// event delegation - 👍
// favourite marked - 👍
// make less refresh or use of DOM in submit button, search button, favourite button, resolve button - 👍
// use id not values 51,107,283,293,305 - 👍
// add timer to each question - 👍

let AllData, questionFlag = false, favFlag = false, timerFlag, imgSrc = ["not favourite.png", "favourite.png"];
AllData = JSON.parse(localStorage.getItem('AllData')) || [];

if (AllData != []) {
    showQuestion();
    timer();
}

document.querySelector('#newFormButton').addEventListener('click', (event) => { // new form button
    event.stopPropagation();
    document.querySelector('.ques').style.display = 'flex';
    document.querySelector('.response').style.display = 'none';
});
document.querySelector('#addQuestionButton').addEventListener('click', (event) => {  // question submit button
    event.stopPropagation();
    questionFlag = true; // question submission flag
    storeQuestion();
});

document.querySelector('#favButton').addEventListener('click', (event) => {  // favourite list button
    event.stopPropagation();
    favFlag = !favFlag;
    // console.log(favFlag);
    showFavQuestion();
});

document.querySelector('.searchField').addEventListener('input', (event) => { // search in all question
    event.stopPropagation();
    searchQuestion();
});

document.querySelector('#resolveButton').addEventListener('click', (event) => {  // resolve submit button
    event.stopPropagation();
    const ques = document.querySelector('.displayQues');
    if (!ques) return;
    const spanID = Number(ques.getAttribute('data-id'));
    resolve(spanID);
});

document.querySelector('#submitButton').addEventListener('click', (event) => {   // add response
    event.stopPropagation();
    storeResponse();
    // popularResp(index); // sort the responses
});

document.querySelector('.allResponse').addEventListener('click', (event) => {   // like or dislike
    event.stopPropagation();
    let ques = document.querySelector('.displayQues');
    if (!ques) return;
    let spanID = Number(ques.getAttribute('data-id'));
    // console.log(ques);

    // let h1 = ques.querySelector('h1').innerText;
    // let p = ques.querySelector('p').innerText;
    let resIndex;
    AllData.forEach((item, index) => {
        // console.log(item.id," matching question ",spanID);
        if (item.id === spanID) {
            resIndex = index;
            // console.log("question index = ",resIndex)
        }
    });
    if (event.target.id === 'like') {
        incLike(resIndex, event.target.closest('span'));
    }
    if (event.target.id === 'dislike') {
        incDislike(resIndex, event.target.closest('span'));
    }
    localStorage.setItem('AllData', JSON.stringify(AllData));
});

document.querySelector('.body').addEventListener('click', (event) => { // any question click in question box
    event.stopPropagation();
    let span = event.target.closest("span");   // finding which question is clicked by event delegation
    if (!span) return;

    let spanID = Number(span.getAttribute('data-id'));
    // let h1 = span.querySelector('h1').innerText;
    // let p = span.querySelector('p').innerText;
    if (event.target.id === 'favIcon') {  // favourite icon
        AllData.forEach((item) => {
            if (item.id === spanID) {
                item.favourite = !item.favourite;
                event.target.src = imgSrc[item.favourite ? 1 : 0];
            }
        });
        localStorage.setItem('AllData', JSON.stringify(AllData));
        showFavQuestion();
        return;
    }
    // event.target.parentNode.remove();
    AllData.find((item, index) => {
        if (item.id === spanID) {
            showResponse(index, spanID);
            // popularResp(index); // sort the responses
        }
    });
});

function showQuestion() {  // append all question
    AllData.forEach((item) => {
        addQuestion(item);
    });
}

function storeResponse() { // store response in array
    let name = document.querySelector('.userName').value;
    let response = document.querySelector('.userResponse').value;
    if (name != "" && response != "") {
        let displayQues = document.querySelector('.displayQues');
        if (!displayQues) return;

        let spanID = Number(displayQues.getAttribute('data-id'));
        let obj = {
            id: Date.now(),
            name: name,
            response: response,
            like: 0,
            dislike: 0,
            createdBy: spanID,
        }
        AllData.forEach((item) => {
            if (item.id === spanID) {
                item.response.push(obj);
            }
        });
        localStorage.setItem('AllData', JSON.stringify(AllData));
        clearInterval(timerFlag);
        addResponse(obj);
        document.querySelector('.userResponse').value = "";
        document.querySelector('.userName').value = "";
    }
    else {
        alert("Please add both fields");
    }
}

function storeQuestion() { // store new question in array
    if (questionFlag) {
        let sub = document.querySelector('.subjectField');
        let que = document.querySelector('.questionField');
        if (sub.value === '' || que.value === '') {
            return;
        }
        const obj = {
            id: Date.now(),
            subject: sub.value,
            question: que.value,
            response: [],
            favourite: false,
        };
        // console.log(obj.id);
        AllData.push(obj);
        localStorage.setItem('AllData', JSON.stringify(AllData));
        questionFlag = false;
        sub.value = "";
        que.value = "";
        addQuestion(obj);
    }
}

function showResponse(index, spanID) { // display add responses
    document.querySelector('.ques').style.display = 'none';
    document.querySelector('.response').style.display = 'flex';
    let displayQues = document.querySelector('.displayQues');
    if (!displayQues) return;
    displayQues.querySelector('h1').innerText = AllData[index].subject;
    displayQues.querySelector('p').innerText = AllData[index].question;
    displayQues.setAttribute('data-id', spanID);
    document.querySelector('.allResponse').innerHTML = '';
    // console.log("empty response");
    if (AllData[index].response.length > 0) {
        AllData[index].response.forEach((item) => {
            addResponse(item);
        });
    }
}

function popularResp(quesIndex) {
    AllData[quesIndex].response = AllData[quesIndex].response.sort((a, b) => (b.like - b.dislike) - (a.like - a.dislike));
    let allResponse = document.querySelector('.allResponse').querySelectorAll('span');
    allResponse.forEach((item, index) => {
        shiftResponses(item, quesIndex, index);
    });
}

function shiftResponses(span, quesIndex, index) {
    span.setAttribute('data-id', AllData[quesIndex].response[index].id);

    span.querySelector('h1').innerText = AllData[quesIndex].response[index].name;
    span.querySelector('p').innerText = AllData[quesIndex].response[index].response;

    span.childNodes[1].childNodes[1].nodeValue = AllData[quesIndex].response[index].like;
    span.childNodes[1].childNodes[3].nodeValue = AllData[quesIndex].response[index].dislike;
    // console.log(span.childNodes[1].childNodes[1]);
    // console.log(span.childNodes[1].childNodes[3]);
}

function addResponse(obj) { // append new response
    let allResponse = document.querySelector('.allResponse');
    if (!allResponse) return;

    let span = document.createElement('span');
    span.setAttribute('data-id', obj.id);
    span.style.width = '100%';
    span.style.display = "flex";
    span.style.flexDirection = "row";
    span.style.justifyContent = 'space-around';
    span.style.padding = '1vmax';

    let div1 = document.createElement('div');
    div1.style.width = "75%";
    div1.style.display = "flex";
    div1.style.flexDirection = "column";
    div1.style.alignItems = "center";

    let h1 = document.createElement('h1');
    let p = document.createElement('p');

    let div2 = document.createElement('div');
    div2.style.width = "25%";
    div2.style.display = "flex";
    div2.style.flexDirection = "row";
    div2.style.alignItems = "center";

    let like = document.createElement('div');
    let likeImg = document.createElement('img');
    const likeText = document.createTextNode(obj.like);

    likeImg.src = 'like.png';
    likeImg.style.width = '4vmax';
    likeImg.style.padding = '0.5vmax';
    likeImg.id = 'like';

    let dislike = document.createElement('div');
    let dislikeImg = document.createElement('img');
    const dislikeText = document.createTextNode(obj.dislike);

    dislikeImg.src = 'dislike.png';
    dislikeImg.style.width = '4vmax';
    dislikeImg.style.padding = '0.5vmax';
    dislikeImg.id = 'dislike';

    h1.innerText = obj.name;
    p.innerText = obj.response;
    h1.style.width = "100%";
    p.style.width = "100%";

    like.append(likeImg);
    dislike.append(dislikeImg);
    div2.append(like);
    div2.append(likeText);
    div2.append(dislike);
    div2.append(dislikeText);
    div1.append(h1);
    div1.append(p);
    span.append(div1);
    span.append(div2);
    allResponse.append(span);
}

function showFavQuestion() {
    let questions = document.querySelector('.body').querySelectorAll('span');
    if (!questions) return;
    if (favFlag) {
        questions.forEach(item => {
            // console.log(item.querySelector('img').src.includes('not'));
            if (item.querySelector('img').src.includes('not')) {
                item.style.display = 'none';
            }
            else {
                item.style.display = 'flex';
            }
        });
    }
    else {
        questions.forEach(item => {
            // console.log(item.querySelector('img').src.includes('not'));
            if (item.querySelector('img').src.includes('not')) {
                item.style.display = 'flex';
            }
        });
    }
}

function resolve(spanID) { // remove from array
    let questions = document.querySelector('.body').querySelectorAll('span');
    if (!questions) return;
    questions.forEach(item => {
        if (Number(item.getAttribute('data-id')) === spanID) {
            item.remove();
        }
    });
    AllData = AllData.filter((item) => item.id !== spanID);
    // console.log(AllData)
    localStorage.setItem('AllData', JSON.stringify(AllData));
    document.querySelector('.ques').style.display = 'none';
    document.querySelector('.response').style.display = 'none';
}

function incLike(index, span) {  // increase like
    if (!span) return;
    let spanID = Number(span.getAttribute('data-id'));
    // console.log(index);
    AllData[index].response.forEach(item => {
        if (item.id === spanID) {
            item.like += 1;
            // showResponse(index, AllData[index].id);
            popularResp(index);
        }
    });
}

function incDislike(index, span) { // increase dislike
    if (!span) return;
    let spanID = Number(span.getAttribute('data-id'));
    AllData[index].response.forEach(item => {
        if (item.id === spanID) {
            item.dislike += 1;
            // showResponse(index, AllData[index].id);
            popularResp(index);
        }
    });
}

function searchQuestion() { // search the questions
    const searchText = document.querySelector('.searchField').value;
    let questions = document.querySelector('.body').querySelectorAll('span');
    if (!questions) return;
    let h1, p;
    questions.forEach((item) => {
        h1 = item.querySelector('h1').innerText;
        p = item.querySelector('p').innerText;
        if (h1.includes(searchText) || p.includes(searchText)) {
            item.style.display = 'flex';
            item.querySelector('h1').innerHTML = h1.replace(new RegExp(searchText, 'gi'), `<mark>${searchText}</mark>`);
            item.querySelector('p').innerHTML = p.replace(new RegExp(searchText, 'gi'), `<mark>${searchText}</mark>`);
        }
        else if (searchText === "") {
            item.style.display = 'none';
            item.querySelector('h1').innerHTML = h1.replace(`<mark>${searchText}</mark>`, searchText);
            item.querySelector('p').innerHTML = p.replace(`<mark>${searchText}</mark>`, searchText);
        }
        else {
            item.style.display = 'none';
        }
    });
}

function addQuestion(item) { // append new question
    let quesBody = document.querySelector('.body');
    if (!quesBody) return;
    let span = document.createElement('span');
    let h1 = document.createElement('h1');
    let p = document.createElement('p');
    let img = document.createElement('img');
    let time = document.createElement('p');
    time.style.fontSize = "1.4vmax";
    time.style.width = '15vmax';
    h1.innerText = item.subject;
    p.innerText = item.question;
    img.src = imgSrc[item.favourite ? 1 : 0];
    img.style.width = '4vmax';
    img.id = "favIcon";
    span.setAttribute('data-id', item.id);
    span.append(h1);
    span.append(p);
    span.append(img);
    span.append(time); // day2
    quesBody.append(span);
    timer();
}

function timer() {
    let span = document.querySelector('.body').querySelectorAll('span');
    timerFlag = setInterval(() => {
        span.forEach((item) => {
            let allTime = getTime(Number(item.getAttribute('data-id')));
            let result = 0;
            // if (allTime.year) result = `${allTime.year} year`;
            // else if (allTime.month) result = `${allTime.month} month`;
            // else if (allTime.week) result = `${allTime.week} week`;
            if (allTime.day) {
                result = `${('0' + allTime.day).slice(-2)} day ${('0' + allTime.hour).slice(-2)} hh`;;
            }
            else if (allTime.hour) {
                result = `${('0' + allTime.hour).slice(-2)} hh ${('0' + allTime.minute).slice(-2)} min`;
            } else if (allTime.minute) {
                result = `${('0' + allTime.minute).slice(-2)} min ${('0' + allTime.second).slice(-2)} sec`;
            } else if (allTime.second) {
                result = `${('0' + allTime.second).slice(-2)} sec`;
            }
            item.querySelectorAll('p')[1].innerText = `${result}'s ago`;
        });
    }, 1000);
}

function getTime(id) {
    let diffTime = Date.now() - id;
    let allTime = {
        'second': parseInt(diffTime / 1000),
        'minute': parseInt(diffTime / (1000 * 60)),
        'hour': parseInt(diffTime / (1000 * 60 * 60)),
        'day': parseInt(diffTime / (1000 * 60 * 60 * 24)),
        // 'week': parseInt(diffTime / (1000 * 60 * 60 * 24 * 7)),
        // 'month': parseInt(diffTime / (1000 * 60 * 60 * 24 * 30)),
        // 'year': parseInt(diffTime / (1000 * 60 * 60 * 24 * 365)),
    }
    if (allTime.second > 60) allTime.second = allTime.second % 60;
    if (allTime.minute > 60) allTime.minute = allTime.minute % 60;
    if (allTime.hour > 60) allTime.hour = allTime.hour % 60;
    if (allTime.day > 60) allTime.day = allTime.day % 24;
    // if (allTime.week > 7) allTime.week = allTime.week % 7;
    // if (allTime.month > 30) allTime.month = allTime.month % 30;
    // if (allTime.year > 365) allTime.year = allTime.year % 365;
    return allTime;
}
