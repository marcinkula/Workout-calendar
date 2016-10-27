$(function() {

    var db = {};

    //data basemodel:
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


        'Nogi': ['Przysiady ze sztangą na barkach', 'Przysiady ze sztangą trzymaną z przodu', 'Przysiady na suwnicy skośnej',
            'Prostowanie nóg w siadzie', 'Wypychanie ciężaru na suwnicy', 'Uginanie nóg w leżeniu', 'Przysiady wykroczne', 'Wysoki step za sztangą/sztangielkami',
            'Odwodzenie nogi w tył', 'Ściąganie kolan w siadzie', 'Przywodzenie nóg do wewnątrz', 'Odwodzenie nóg na zewnątrz',
            '”Martwy ciąg”na prostych nogach', 'Wspiecia na palce w staniu', 'Wspięcia na palce w siadzie', 'Wspięcia na palce na „HACK-MASZYNIE”'
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
    //
    // data-toggle="tooltip" data-placement="right" title="Tooltip on right"

    function saveDataToBackend() {
        firebase
            .database()
            .ref('db')
            .set(db);
    }

    function getDataFromBackend() {
        firebase
            .database()
            .ref('db') //odwołujemy się do konkretnego klucza
            .on('value', function(data) {
                console.log(data.val());
                db = data.val();
                renderView();
            });
    }

    function renderView() {

        $('#saved-exercises').html(''); //czyszcze na samym poczatku bo jak zmieniam date chce miec czyste
        var resultHtml = ''; //tu bede doklejac wszystko
        var bodyParts = db[currentDate]; //klatka piersiowa, plecy, barki itd
        console.log('bodyParts', bodyParts);
        for (var item in bodyParts) {
            console.log(item);
            resultHtml += '<h3>' + item + '</h3>'; //kazdy body part bedzie w h3
            console.log('db[currentDate][item]', db[currentDate][item]);

            //guzik do kasowania
            resultHtml += '<button class="remove-part btn btn-danger btn-sm glyphicon glyphicon-trash" data-toggle="tooltip" data-placement="right" title="Usuń wybraną grupę mięśniową" data-date="' + currentDate + '" data-part="' + item + '"></button>'; //identyfikujemy co mamy wywalic


            var exerciseObj = db[currentDate][item]; //dla kazdego body parta tworze obiekt zawierajacy wszystki cwiczenia
            for (var itemChild in exerciseObj) { //iteruje po obiekcie z cwiczeniami
                console.log(itemChild);
                resultHtml += '<h4>' + itemChild + '</h4>'; //kazde cwiczenie idzie do diva
                console.log('exerciseObj[itemChild]', exerciseObj[itemChild]);
                resultHtml += '<h5>Ilość serii: ' + exerciseObj[itemChild].seriesCount + //seriesCount i repeatCount zawsze jest takie samo wiec moge tak sie do nich dostac (przez kropke)
                    ' <br>Liczba powtórzen: ' + exerciseObj[itemChild].repeatCount + '</h5>';
            }
        }

        $('#saved-exercises').html(resultHtml); //na koncu wstrzykuje do diva cale powyzsze
    }


    function changeMainView() {
        // http://bootstrap-datepicker.readthedocs.io/en/latest/markup.html
        // This is to save the embedded datepicker:
        var selectedDate = $('#datepicker').datepicker('getFormattedDate');
        console.log('selectedDate: ', selectedDate);
        currentDate = selectedDate; //przypisuje wybrana date do zmiennej currentDate ktorej uzywam w innych czesciach aplikacji
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


    getDataFromBackend(); //pobieram dane z Firebase

    // http://momentjs.com - library for tormatting the date
    // We are setting current date here

    $('#selected-date').html(currentDate);

    // Tworzenie zaleznej listy http://jsfiddle.net/arunpjohny/2pza5/
    var exerciseElement = $('#exercise');
    $('#musclegroup').on("change", function() {
        var musclePart = $(this).val();
        var exerciseArray = muscleGroups[musclePart] || []; //tablica dla specyficznego body part lub pusta tablica zeby w drugim wyswietlilo sie puste

        var html = $.map(exerciseArray, function(exerciseItem) { // .map iteruje po tablicy, pierwsy element to tablica drugi to jkazdy element tablicy (tworzy option w selekcie)
            return '<option value="' + exerciseItem + '">' + exerciseItem + '</option>'
        }).join(''); //laczy wszystkie option value w jeden string

        exerciseElement.html(html) //wstrzykuje powyzszego stringa w moj select
        $('#exercise-detials').html(detailedTemplate); //na koncu doklejam templatke z imputami
    });

    $('body').on('change', 'input[type="number"]', function() {
            if ($(this).val() < 0) {
                $(this).val(0);
            }
        })
        //Kiedy klikam na save

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

        //Uaktualnianie modelu danych
        // Check if there is a record in db with this date
        if (db[currentDate] !== undefined) {
            console.log('Ta data juz jest w bazie');

            if (db[currentDate].hasOwnProperty(selectedBodyPart)) { //sprawdza czy ten obiekt z data ma dane property
                console.log('Istnieje juz ten bodyPart dla tej daty');

                if (db[currentDate][selectedBodyPart].hasOwnProperty(selectedExercise)) { //teraz sprawdzam czy istnieje cwiczenie
                    // Istnieje juz zapisane to samo cwiczenie
                    console.log('Istnieje juz zapisane to samo cwiczenie dla tego bodyPart');
                    // db["2016-10-25"]["Klatka piersowa"]["Wyciskanie hantli"] = {
                    //     repeatCount: 20,
                    //     seriesCount: 30
                    // }
                    db[currentDate][selectedBodyPart][selectedExercise] = {
                        seriesCount: seriesCount,
                        repeatCount: repeatCount
                    }
                } else {
                    console.log('NIE Istnieje jeszcze zapisane to cwiczenie');
                    db[currentDate][selectedBodyPart][selectedExercise] = {
                        seriesCount: seriesCount,
                        repeatCount: repeatCount
                    }
                }
            } else { //jesli nie ma takiego body parta
                db[currentDate][selectedBodyPart] = {}; //to trzeba go utworzyc
                db[currentDate][selectedBodyPart][selectedExercise] = { //nastepnie tworze cwiczenie
                    seriesCount: seriesCount,
                    repeatCount: repeatCount
                }
            }
            console.log(db);
        } else { //jesi w ogole nie ma takiej daty w bazie
            console.log('Tej daty nie ma w bazie', currentDate);
            db[currentDate] = {}; //wtedy musze utworzyc nowy obiekt
            db[currentDate][selectedBodyPart] = {} // tworze obiekt z cwiczeniem
            db[currentDate][selectedBodyPart][selectedExercise] = { //nastepnie tworze cwiczenie
                seriesCount: seriesCount,
                repeatCount: repeatCount
            }
            console.log(db);
        }

        //When all the changes to the database are done we can render view again
        renderView();

        //function uploading data to Firebase
        saveDataToBackend()

    });

    $('body').on('click', '.remove-part', function() {
        var bodyPart = $(this).attr('data-part');
        var currentDate = $(this).attr('data-date');
        console.log('Removing....', bodyPart, currentDate);
        delete db[currentDate][bodyPart]; // https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Operatory/Operator_delete
        saveDataToBackend(); //musimy wyslac do firebase
        renderView(); //jeszcze raz wyswietlic
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
