'use strict';

/*class question*/
class currentQuest {
    constructor(user, title, descr) {
        this.user = user;
        this.date = Date.now();
        this.title = title;
        this.description = descr;
        this.hasAnswer = false;
        this.answers = [];
    }
}

/*class answer*/
class currentAnswer {
    constructor (user, descr) {
        this.ansID = Date.now();
        this.ansUser = user;
        this.ansDescription = descr;
    }
}

/*default function to load data & check user verification*/
let getData = () => {
    verificationUserLogin();
    getQuestions ();
};

/*render item questions*/
let renderQuestion = (data) => {
    let context = {},
        source = $('#questionTemplate').html(),
        item = Handlebars.compile(source);

        context.question = data;
    $('#questions').prepend(item(context));
};

let verificationUserLogin = () => {
    let user = localStorage.getItem('stackoverflow_session_user_name');
    user = JSON.parse(user);
    if (user) {
        userAuthentication(user);
        $('.beforeLogin').addClass('hide');
    }
};

$('.login').on('click', () => {
    $('.formLogin').removeClass('hide');
    $('.beforeLogin').addClass('hide');
});

/*submit login form*/
$('.formLogin').submit((e) => {
    e.preventDefault();
    let userName = $('#userName').val();
    let userPassword = $('#userPassword').val();

    if(userName && userPassword) {
        userAuthentication(userName);
        resetLoginForm();
    }
});

/*check user authentication*/
let userAuthentication = (user) => {
    userData(user);
    hideLoginForm();
    showQuestionForm();
    showAskForm ();
};

let showAskForm = () => {
    $('.newAnswer').removeClass('hide');

};

let hideLoginForm = () => {
    $('.formLogin').addClass('hide');
    $('.login').addClass('hide');
};

let showQuestionForm = () => {
    $('.newQuestion').removeClass('hide');
};

/*get data of item question*/
$(".newQuestion").submit((e) => {
    e.preventDefault();
    let title = $('#questionTitle').val();
    let description = $('#questionBody').val();
    let userName = getLocalData();

    let questionInfo = [];
    let itemQuestion = new currentQuest (userName, title, description);
    questionInfo.push(itemQuestion);

    renderQuestion(questionInfo);
    newQuestion(itemQuestion);
    resetQuestionForm();
});

/*get user name from local storage*/
let getLocalData = () => {
    let userName = localStorage.getItem('stackoverflow_session_user_name');
    return userName = JSON.parse(userName);
};

/*reset data of question form*/
let resetQuestionForm = () => {
    $('#questionTitle, #questionBody').val('');
};

/*reset login form data*/
let resetLoginForm = () => {
    $('#userName, #userPassword').val('');
};

/*write user data to local storage*/
let userData = (userData) => {
    $('.userName').removeClass('hide');
    $('.userNameItem').append(userData);

    let user = JSON.stringify(userData);
    localStorage.setItem('stackoverflow_session_user_name', user);
};

/*remove all questions in container*/
let cleanQuestion = () => {
    $('#questions').html('');
};

/*question status (tabs)*/
$('li').on('click', (e) => {
    let current = $(e.currentTarget);
    let currentValue = current.html();

    if (currentValue === 'Unanswered' || currentValue === 'Answered') {
        questionStatus (currentValue);
        $('li').removeClass('active');
        if (current === 'Unanswered'){
            current.addClass('active');
        } else {current.addClass('active')}
    } else {
        current.addClass('active');
        getQuestions ();
    }
});

/*logout item user & remove local storage*/
$('.logOut').on('click', () => {
    localStorage.removeItem('stackoverflow_session_user_name');
    $('.userName, .newQuestion, .form-answer').addClass('hide');
    $('.login, .beforeLogin').removeClass('hide');
});

/*create new object answer*/
$('.newAnswer').submit((e) => {
    e.preventDefault();
    let userName = getLocalData ();
    let answerBody = $('#newAnswerBody').val();
    let itemQuestionID = $('#item').attr('data-id');

    let answer = new currentAnswer(userName, answerBody);
    newAnswer(itemQuestionID, answer);
    removeAnswerArea();
});

/*removed textarea data*/
let removeAnswerArea= () => {
    $('#newAnswerBody').val('');
};
