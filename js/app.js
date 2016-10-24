$(function() {
    console.log('Project start!');

    // http://momentjs.com/
    // Set up start date
    $('#selected-date').html(moment().format('YYYY-MM-DD'));

    var muscleGroup = {
        "chest" : ["bench press", "pushups"],
        "back" : ["podciaganie", "sranie", "skakanie", "siadanie"],
        "shoulders" : ["wyciskanie hantli"],
        "legs" : ["przysiady"],
        "biceps" : ["uginanie ramion"],
        "triceps": ["wyciskanie francuskie"]
    };


    // Mock up DB
    var db = {
        "2016-10-24": {
            parties: {
                "back": {
                    podciaganie: 3,
                    lezenie: 2
                },
                "legs": {
                    przysiady: 10,
                    podskoki: 20
                }
            }
        },
        "2016-10-23": {
            parties: {
                "legs": ["przysiady"]
            }
        }
    };

    //db["2016-10-24"].parties.legs = ["fdsfsd"];

    $('#exercise-list > li').click(function() {

        // TODO: Sprawdzanie czy juz jest na liscie dane cwiczenie
        var exercise = $(this).html().toLowerCase();

        var specificExerciseList = muscleGroup[exercise];
        console.log('specificExerciseList: ', specificExerciseList);

        function createListItems(specificExerciseList) {
            var resultString = '';
            for (var i = 0; i < specificExerciseList.length; i++) {
                resultString += '<li>' + specificExerciseList[i] + '</li>'
            }
            return resultString;
        }

        $('#selected-exercises').append('<li>' + exercise + '<div class="dropdown">' +
                      '<button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        'Add Specific Exercises<span class="caret"></span></button>' +
                        '<ul id="specific-exercise-list-' + exercise + '" class="dropdown-menu" aria-labelledby="dLabel">' +
                        createListItems(specificExerciseList)
                        + '</ul>' +
                    '</div></li>');
    });


    function changeMainView() {
        // http://bootstrap-datepicker.readthedocs.io/en/latest/markup.html
        var selectedDate = $('#datepicker').datepicker('getFormattedDate');
        console.log('selectedDate: ', selectedDate);
        $('#selected-date').html(selectedDate);

        for (var date in db) {
            if (date === selectedDate) {
                console.log(db[date].parties);
            }
        }
    }

    function today() {
        return new Date(); //local date of computer un js
    }

    // Initializing DatePicker
    $('#datepicker')
        .datepicker({
            startView: 0,
            format: "yyyy-mm-dd"
        })
        .on("changeDate", changeMainView);
});
