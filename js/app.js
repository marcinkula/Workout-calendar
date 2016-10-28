$(function() {

    var db = {};

    //database model:
    // var db = {
    //     "2019-10-20": {
    //         "Klatka piersiowa": {
    //             "Wyciskanie hantli": {
    //                 repeatCount: 1,
    //                 seriesCount: 1
    //             }
    //         }
    //     }
    // };

    var currentDate = moment().format('YYYY-MM-DD');

    var muscleGroups = {
        'Klatka piersiowa': ['Wyciskanie sztangi na ławce poziomej', 'Wyciskanie hantli na ławce poziomej',
            'Wyciskanie sztangi głową w górę', 'Wyciskanie hantli głową w górę', 'Wyciskanie sztangi głową w dół',
            'Wyciskanie hantli głową w dół', 'Rozpiętki na ławce poziomej', 'Rozpiętki głową do góry', 'Rozpiętki głową w dół',
            'Krzyżowanie linek wyciągu w staniu', 'Wyciskania poziome na maszynie', 'Przenoszenie hantli w leżeniu w poprzek ławki'
        ],

        'Plecy': ['Podciąganie na drążku szerokim nachwytem', 'Podciąganie na drążku w chwycie neutralnym', 'Podciąganie na drążku podchwytem',
            'Podciąganie sztangi w opadzie tułowia', 'Podciąganie hantli w opadzie tułowia', 'Podciąganie końca sztangi w opadzie',
            'Przyciąganie linki wyciągu dolnego w siadzie', 'Przyciąganie linki wyciągu górnego w siadzie', 'Ściąganie drążka wyciągu górnego szerokim nachwytem',
            'Ściąganie drążka wyciągu górnego podchwytem', 'Ściąganie drążka wyciągu górnego chwytem neutralnym', 'Unoszenie tułowia z opadu',
            'Martwy ciąg'
        ],

        'Barki': ['Wyciskanie sztangi sprzed głowy', 'Wyciskanie sztangi zza głowy', 'Wyciskanie sztangielek', 'Arnoldki',
            'Unoszenie sztangielek bokiem w górę', 'Unoszenie sztangielek w opadzie tułowia', 'Podciąganie sztangi wzdłuż tułowia',
            'Podciąganie sztangielek wzdłuż tułowia', 'Unoszenie ramion w przód ze sztangą', 'Unoszenie ramion w przód ze sztangielkami',
            'Unoszenie ramion w przód z linkami wyciągu', 'Unoszenie ramion bokiem w górę z linkami wyciągu', 'Odwrotne rozpiętki (na linkach)'
        ],

        'Biceps': ['Uginanie ramion ze sztangą stojac podchwytem', 'Uginanie ramion ze sztangielkami stojąc podchwytem', 'Uginanie ramion ze sztangielkami stojąc (uchwyt „młotkowy”)',
            'Uginanie ramion ze sztangą na „modlitewniku”', 'Uginanie ramienia ze sztangielką na „modlitewniku”', 'Uginanie ramion ze sztangielkami w siadzie na ławce skośnej',
            'Uginanie ramienia ze sztangielką w siadzie-w podporze o kolano', 'Uginanie ramion podchwytem stojąc-z rączką wyciągu', 'Uginanie ramion ze sztanga nachwytem stojąc',
            'Uginanie ramion ze sztanga nachwytem na „modlitewniku”'
        ],

        'Triceps': ['Prostowanie ramion na wyciągu stojąc', 'Wyciskanie „francuskie”sztangi w siadzie', 'Wyciskanie “francuskie” jednorącz sztangielki w siadzie',
            'Wyciskanie „francuskie” sztangi w leżeniu', 'Wyciskanie „francuskie”sztangielki w leżeniu', 'Prostownie ramienia ze sztangielką w opadzie tułowia',
            'Prostowanie ramion na wyciągu w płaszczyźne poziomej stojąc', 'Pompki na poręczach', 'Pompki w podporze tyłem',
            'Prostowanie ramienia podchwytem na wyciągu stojąc', 'Wyciskanie w leżeniu na ławce poziomej wąskim uchwytem'
        ],

        'Nogi': ['”Martwy ciąg”na prostych nogach', 'Odwodzenie nóg na zewnątrz', 'Odwodzenie nogi w tył', 'Prostowanie nóg w siadzie',
            'Przysiady ze sztangą na barkach', 'Przysiady ze sztangą trzymaną z przodu', 'Przysiady na suwnicy skośnej', 'Przysiady wykroczne',
            'Przywodzenie nóg do wewnątrz', 'Ściąganie kolan w siadzie', 'Uginanie nóg w leżeniu', 'Wysoki step za sztangą/sztangielkami',
            'Wspiecia na palce w staniu', 'Wspięcia na palce w siadzie', 'Wspięcia na palce na „HACK-MASZYNIE”', 'Wypychanie ciężaru na suwnicy'
        ],

        'Brzuch': ['Skłony w leżeniu płasko', 'Skłony w leżeniu głową w dół', 'Unoszenie nóg w leżeniu na skośnej ławce', 'Unoszenie nóg w zwisie na drążku',
            'Unoszenie nóg w podporze', 'Spinanie/unoszenie kolan w leżeniu płasko', 'Skłony tułowia z linką wyciągu siedząc',
            'Skręty tułowia', 'Skłony tułowia z linką wyciągu klęcząc', 'Skłony boczne', 'Skłony boczne na ławce', 'Skręty tułowia w leżeniu'
        ],

    }

    var detailedTemplate = '<div>' +
        '<input type="number" data-toggle="tooltip" data-placement="right" title="Wpisz ilość serii" id="seriesCount" placeholder="Ilość serii"><br/>' +
        '<input type="number" data-toggle="tooltip" data-placement="right" title="Wpisz ilość powtórzeń" id="repeatCount" placeholder="Liczba powtórzen">' +
        '</div>';

    function saveDataToBackend() {
        firebase
            .database()
            .ref('db')
            .set(db);
    }

    function getDataFromBackend() {
        firebase
            .database()
            .ref('db')
            .on('value', function(data) {
                db = data.val();
                renderView();
            });
    }

    function renderView() {

        $('#saved-exercises').html(''); //Clearing my div
        var resultHtml = ''; //string where the data will be put
        var bodyParts = db[currentDate];
        console.log('bodyParts', bodyParts);
        for (var item in bodyParts) {
            // console.log(item);
            resultHtml += '<h3>' + item + '</h3>'; //each body part will be put in h3
            // console.log('db[currentDate][item]', db[currentDate][item]);

            //removal button
            resultHtml += '<button class="remove-part btn btn-danger btn-sm glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="right" title="Usuń wybraną grupę mięśniową" data-date="' + currentDate + '" data-part="' + item + '"></button>'; //identyfikujemy co mamy wywalic

            var exerciseObj = db[currentDate][item]; //for each body part I create object containing all exercises
            for (var itemChild in exerciseObj) { //itering through my object by exercises
                // console.log(itemChild);
                resultHtml += '<h4>' + itemChild + '</h4>'; //each exercise will be put in h4
                // console.log('exerciseObj[itemChild]', exerciseObj[itemChild]);
                resultHtml += '<h5>Ilość serii: ' + exerciseObj[itemChild].seriesCount + //seriesCount i repeatCount don't change so I can get to them via dot
                    ' <br>Liczba powtórzen: ' + exerciseObj[itemChild].repeatCount + '</h5>';
            }
        }

        $('#saved-exercises').html(resultHtml); //at the end I inject the above in the div#saved-exercises
    }


    function changeMainView() {
        // http://bootstrap-datepicker.readthedocs.io/en/latest/markup.html
        // This is to save the embedded datepicker:
        var selectedDate = $('#datepicker').datepicker('getFormattedDate');
        console.log('selectedDate: ', selectedDate);
        currentDate = selectedDate; //Assigning the picked date to the currentDate date variable, it will be needed in other parts of my application
        $('#selected-date').html(selectedDate);
        getDataFromBackend();
        var selectedBodyPart = $('#musclegroup').val('');
        var selectedExercise = $('#exercise').val('');
        var seriesCount = $('#seriesCount').val('');
        var repeatCount = $('#repeatCount').val('');
    }


    //http://www.w3schools.com/js/js_dates.asp
    //Using new Date(), creates a new date object with the current date and time
    function today() {
        return new Date(); //local date on my computer
    }


    getDataFromBackend(); //getting data from Firebase

    // http://momentjs.com - library for tormatting the date
    // We are setting current date here

    $('#selected-date').html(currentDate);

    // Dependant select list creation http://jsfiddle.net/arunpjohny/2pza5/
    var exerciseElement = $('#exercise');
    $('#musclegroup').on("change", function() {
        var musclePart = $(this).val();
        var exerciseArray = muscleGroups[musclePart] || []; //array for a specific body or an empty array so that in other select there is un empty select too

        var html = $.map(exerciseArray, function(exerciseItem) {
            return '<option value="' + exerciseItem + '">' + exerciseItem + '</option>'
        }).join('');

        exerciseElement.html(html) //injecting the above string in #exercise select
        $('#exercise-details').html(detailedTemplate); //adding the template with inputs to div#exercise-details
    });

    $('body').on('change', 'input[type="number"]', function() {
        if ($(this).val() < 0) {
            $(this).val(0);
        }
    })

    //When clicking "Zapisz" button
    $('#save-details').on('click', function() {
        var selectedBodyPart = $('#musclegroup').val();
        var selectedExercise = $('#exercise').val();
        var seriesCount = $('#seriesCount').val();
        var repeatCount = $('#repeatCount').val();

        // Check if any body part is selected
        if (selectedBodyPart.length < 1) {
            alert('Wybierz grupę mięśniową!');
            return;
        }
        //Updating database model
        // Check if there is a record in db with this date
        if (db[currentDate] !== undefined) {
            // console.log('This date is already in the databse');

            if (db[currentDate].hasOwnProperty(selectedBodyPart)) { //check if this object has a given property
                // console.log('The given bodypart already exists for this date');

                if (db[currentDate][selectedBodyPart].hasOwnProperty(selectedExercise)) { //checking if the specific exercise exists
                    // console.log('This exercice already exists for this body part');
                    // db["2016-10-25"]["Klatka piersowa"]["Wyciskanie hantli"] = {
                    //     repeatCount: 20,
                    //     seriesCount: 30
                    // }
                    db[currentDate][selectedBodyPart][selectedExercise] = {
                        seriesCount: seriesCount,
                        repeatCount: repeatCount
                    }
                } else {
                    // console.log('There is no such exercise in the database');
                    db[currentDate][selectedBodyPart][selectedExercise] = {
                        seriesCount: seriesCount,
                        repeatCount: repeatCount
                    }
                }
            } else { //if this body part doesn't exist
                db[currentDate][selectedBodyPart] = {}; //create it
                db[currentDate][selectedBodyPart][selectedExercise] = { //and then creating the exercise
                    seriesCount: seriesCount,
                    repeatCount: repeatCount
                }
            }
            // console.log(db);
        } else { //if there is no such date in the database yet
            // console.log('There is no such date in the database', currentDate);
            db[currentDate] = {}; //creating a new object
            db[currentDate][selectedBodyPart] = {} // creating an object with body part
            db[currentDate][selectedBodyPart][selectedExercise] = { //then creating an exercise
                seriesCount: seriesCount,
                repeatCount: repeatCount
            }
            console.log(db);
        }
        //When all the changes to the database are done we can render the view again
        renderView();
        //function uploading data to Firebase
        saveDataToBackend();

    });

    //removing body part
    $('body').on('click', '.remove-part', function() {
        var bodyPart = $(this).attr('data-part');
        var currentDate = $(this).attr('data-date');
        console.log('Removing....', bodyPart, currentDate);
        delete db[currentDate][bodyPart]; // https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Operatory/Operator_delete
        saveDataToBackend(); //sending data to Firebase
        renderView(); //and display it again
    });

    // Initializing DatePicker
    //https://bootstrap-datepicker.readthedocs.io/en/latest/
    //https://bootstrap-datepicker.readthedocs.io/en/latest/events.html#changedate
    //http://stackoverflow.com/questions/22507671/bootstrap-datepicker-change-date-event-doesnt-fire-up-when-manually-editing-date

    $('#datepicker')
        .datepicker({
            format: "yyyy-mm-dd"
        })
        .on("changeDate", changeMainView);


});
