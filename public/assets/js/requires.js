'use strict';

/*all questions*/
let getQuestions = () => {
    $.ajax({
        url: "/api/questions",
        method: "GET",
        contentType: 'application/json'
    }).done( (data) => {
        cleanQuestion();
        renderQuestion(data);
    });
};

/*require answered & unanswered questions*/
let questionStatus = (currentStatus) => {
    $.ajax({
        url: "/api/questions/" + currentStatus,
        method: "GET",
        contentType: 'json'
    }).done( (data) => {
        cleanQuestion();
        renderQuestion(data);
    });
};

/*require new question*/
let newQuestion = (question) => {
    $.ajax({
        url: "/api/questions/",
        method: "POST",
        dataType: 'json',
        data: question
    });
};

let getItemQuestion = (id) => {
    $.ajax({
        url: "/api/questions/" + id,
        method: "GET",
        dataType: 'json'
    });
};

/*require new answer*/
let newAnswer = (id, answer) => {
    $.ajax({
        url: "/api/questions/" + id,
        method: "POST",
        dataType: 'json',
        data: answer
    }).done(() => {
        getItemQuestion(id);
    });
};
