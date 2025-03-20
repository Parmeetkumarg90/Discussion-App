let AllData = [], stFlag = false, sea_flag = false;

document.querySelectorAll('button')[0].addEventListener('click', (event) => { // new form button
    event.stopPropagation();
    showQuestion();
});
function showQuestion() {
    document.querySelector('.ques').style.display = 'flex';
    document.querySelector('.response').style.display = 'none';
}
document.querySelectorAll('button')[1].addEventListener('click', (event) => {  // question submit button
    document.querySelector('.ques').style.display = 'none';
    document.querySelector('.response').style.display = 'none';
    event.stopPropagation();
    stFlag = true;
    storeQuestion();
});
document.querySelectorAll('input')[0].addEventListener('input', (event) => {
    event.stopPropagation();
    sea_flag = true;
    // console.log("entered");
    storeQuestion();
});
function storeQuestion() {
    if (stFlag) {
        let sub = document.querySelectorAll('input')[1];
        let que = document.querySelectorAll('textarea')[0];
        if (sub.value === '' || que.value === '') {
            //  console.log(sub.value,que.value)
            alert("Please Fill both subject and question........");
            return;
        }
        const obj = {
            subject: sub.value,
            question: que.value,
            response: []
        };
        // console.log(obj);
        AllData.push(obj);
        stFlag = false;
        sub.value = "";
        que.value = "";
    }
    // console.log(AllData);
    let quesBody = document.querySelector('.body');
    quesBody.innerHTML = "";
    AllData.forEach((item) => {
        if (sea_flag === true && document.querySelectorAll('input')[0].value !== "") {
            // console.log(item.subject, document.querySelectorAll('input')[0].value)
            if (item.subject === document.querySelectorAll('input')[0].value) {
                let span = document.createElement('span');
                let h1 = document.createElement('h1');
                let p = document.createElement('p');
                h1.innerText = item.subject;
                p.innerText = item.question;
                span.append(h1);
                span.append(p);
                quesBody.append(span);
            }
        }
        else if (document.querySelectorAll('input')[0].value === "") {
            let span = document.createElement('span');
            let h1 = document.createElement('h1');
            let p = document.createElement('p');
            h1.innerText = item.subject;
            p.innerText = item.question;
            span.append(h1);
            span.append(p);
            quesBody.append(span);
        }
    });
    sea_flag = false;
}

document.querySelector('.body').addEventListener('click', (event) => {
    event.stopPropagation();
    let span = event.target.closest("span");
    if (span === null) {
        return;
    }
    document.querySelectorAll('button')[0].disabled = true;
    if (document.querySelector('.response').style.display === 'flex') {
        alert("One Task is currently running.....");
        return;
    }
    event.target.parentNode.remove();
    let h1 = span.querySelector('h1').innerText;
    let p = span.querySelector('p').innerText;
    // let dIndex = -1;
    AllData.find((item, index) => {
        if (item.subject === h1 && item.question === p) {
            // dIndex = index;
            showResponse(index);
            return;
        }
    });
    // console.log(dIndex);
});
function showResponse(index) {
    document.querySelector('.ques').style.display = 'none';
    document.querySelector('.response').style.display = 'flex';
    let displayQues = document.querySelector('.displayQues');
    let h1 = displayQues.querySelector('h1');
    let p = displayQues.querySelector('p');
    h1.innerText = AllData[index].subject;
    p.innerText = AllData[index].question;
    let allResponse = document.querySelector('.allResponse');
    allResponse.innerHTML = "";
    if(AllData[index].response.length > 0){
        AllData[index].response.forEach((item)=>{
            let span = document.createElement('span');
            let h1 = document.createElement('h1');
            let p = document.createElement('p');
            h1.innerText = item.name;
            p.innerText = item.response;
            span.append(h1);
            span.append(p);
            allResponse.append(span);
        });
    }
    else{
        let h1 = document.createElement('h1');
        h1.innerText = "No Response Yet";
        allResponse.append(h1);
    }
}

document.querySelectorAll('button')[2].addEventListener('click', (event) => {  // resolve submit button
    event.stopPropagation();
    document.querySelectorAll('button')[0].disabled = false;
    resolve();
});
function resolve() {
    let displayQues = document.querySelector('.displayQues');
    let h1 = displayQues.querySelector('h1').innerText;
    let p = displayQues.querySelector('p').innerText;
    AllData = AllData.filter((item) => item.subject !== h1 && item.question !== p);
    document.querySelector('.ques').style.display = 'none';
    document.querySelector('.response').style.display = 'none';
}

document.querySelectorAll('button')[3].addEventListener('click', (event) => {   // add response
    event.stopPropagation();
    document.querySelectorAll('button')[0].disabled = false;
    // alert("click");
    addResponse();
});

function addResponse() {
    let name = document.querySelectorAll('input')[2].value;
    let response = document.querySelectorAll('textarea')[1].value;
    if (name === "" || response === "") {
        alert("Please Fill both name and response........");
    }
    else {
        let displayQues = document.querySelector('.displayQues');
        let h1data = displayQues.querySelector('h1').innerText;
        let pdata = displayQues.querySelector('p').innerText;

        // console.log(name,response);
        let obj = {
            name: name,
            response: response
        }
        AllData.forEach((item) => {
            if (item.subject === h1data && item.question === pdata) {
                item.response.push(obj);
                // console.log(item.response)
            }
        });
        // console.log(AllData);
        // let quesBody = document.querySelector('.body');
        // let span = document.createElement('span');
        // h1.innerText = h1data;
        // p.innerText = pdata;
        // span.append(h1);
        // span.append(p);
        // quesBody.append(span);

        // span.innerHTML = "";

        let allResponse = document.querySelector('.allResponse');
        let span = document.createElement('span');
        let h1 = document.createElement('h1');
        let p = document.createElement('p');
        h1.innerText = name;
        p.innerText = response;
        span.append(h1);
        span.append(p);
        allResponse.append(span);

        document.querySelectorAll('input')[2].value = "";
        document.querySelectorAll('textarea')[1].value = "";
    }
    storeQuestion();
    document.querySelector('.ques').style.display = 'none';
    document.querySelector('.response').style.display = 'none';
}