$(function() {
    console.log('Project start!');

    // http://momentjs.com/
    // Formatting the date
    $('#selected-date').html(moment().format('YYYY-MM-DD'));

    var muscleGroup = {
        "chest" : ["wyciskanie sztangi", "pompki"],
        "back" : ["podciaganie", "przyciaganie", "martwy ciag", "wykroki"],
        "shoulders" : ["wyciskanie hantli"],
        "legs" : ["przysiady", "wypychanie nog"],
        "biceps" : ["uginanie ramion"],
        "triceps": ["wyciskanie francuskie"]
    };


    //DB
    var db = {
        "2016-10-01": {
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
        "2016-10-02": {
            parties: {
                "legs": ["przysiady"]
            }
        }
    };

    var muscleGroups = {
        'Klatka piersiowa': ['Wyciskanie hantli', 'Wyciskanie sztangi', 'pompki'],
        'Plecy': ['Podciaganie', 'wioslowanie sztanga'],
        'Barki': ['Szrugsy', 'Wzniosy hantli bokiem'],
        'Biceps': ['Podciaganie wasko', 'Uginanie ramion'],
        'Triceps': ['Wyciskanie hantli'],
        'Nogi': ['Prostowaie nog', 'Uginanie nog lezac'],

    }

    var detailedTemplate = '<div>'
    + '<input type="number" placeholder="Ilość serii"><br/>'
    + '<input type="number" placeholder="Liczba powtorzen">'
    + '</div>';

    var exerciseElement = $('#exercise');
    $('#musclegroup').change(function () {
        var musclePart = $(this).val();
        var exerciseArray = muscleGroups[musclePart] || [];

        var html = $.map(exerciseArray, function(exerciseItem){ // .map iteruje po tablicy
            return '<option value="' + exerciseItem + '">' + exerciseItem + '</option>'
        }).join('');

        exerciseElement.html(html)
        $('#exercise-detials').html(detailedTemplate);
    });

    // //db["2016-10-24"].parties.legs = ["przysiady"];

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
        // This is to save the embedded datepicker:
        var selectedDate = $('#datepicker').datepicker('getFormattedDate');
        console.log('selectedDate: ', selectedDate);
        $('#selected-date').html(selectedDate);

        for (var date in db) { //http://stackoverflow.com/questions/8312459/iterate-through-object-properties
            if (date === selectedDate) {
                console.log(db[date].parties);
            }
        }
    }

    //http://www.w3schools.com/js/js_dates.asp
    //Using new Date(), creates a new date object with the current date and time
    function today() {
        return new Date(); //local date on my computer in js
    }

    // Initializing DatePicker
    $('#datepicker')
        .datepicker({
            startView: 0,
            format: "yyyy-mm-dd"
        })
        .on("changeDate", changeMainView);





    var okButton = $('#accept');
    var ulPlannedExcercises = $("#plannedexcercise");

    okButton.on('click', function(e){
        e.preventDefault();
        var newLi = $("<li>");

        var label1 = $("<label>Ilisc serii</label>");
        var input1 = $("<input type='number'>");

        label1.append(input1);

        var label2 = $("<label>Liczba powtorzen</label>");
        var input2 = $("<input type='number'>");

        label2.append(input2);

    newLi.append(label1).append(label2);
    ulPlannedExcercises.append(newLi);

});




//
// var partieMiesniowe = {
//     "oko" : ["mruganie", "plakanie"],
//     "ucho" : ["zatykanie", "zamykanie", "zalewanie", "sluchanie"],
//     "lydka" : ["wzniosy"],
//     "kark" : ["spina", "lamanie"],
// };
//
//
// var indyvidualExerciseList = partieMiesniowe[exercise];
//
// function createExcerciseList(indyvidualExerciseList) {
//     var resultStr = '';
//     for (var i = 0; i < specificExerciseList.length; i++) {
//         resultStr += '<li>' + indyvidualExerciseList[i] + '</li>'
//     }
//     return resultString;
// }
//
// var partieMiesniowe = {
//     "oko" : ["mruganie", "plakanie"],
//     "ucho" : ["zatykanie", "zamykanie", "zalewanie", "sluchanie"],
//     "lydka" : ["wzniosy"],
//     "kark" : ["spina", "lamanie"],
// };


// <select name="muscle_type">
//     <option value="1">Oko</option>
//     <option value="2">Ucho</option>
//     <option value="3">Lydka</option>
//     <option value="4">Kark</option>
// </select>



var dropdown = $('#muscle_type');
console.log(dropdown.val());

var value = $('select#muscle_type option:selected').val();
console.log(value);




















});
