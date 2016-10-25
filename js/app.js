$(function() {
    console.log('Project start!');

    // http://momentjs.com/
    // Formatting the date
    $('#selected-date').html(moment().format('YYYY-MM-DD'));

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

});
