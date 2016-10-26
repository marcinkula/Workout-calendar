$(function() {
    console.log('Project start!');

    // http://momentjs.com - library for tormatting the date
    // We are setting current date here
    var currentDate = moment().format('YYYY-MM-DD');
    $('#selected-date').html(currentDate);


    var db = {
        "2019-10-20": {
            "Klatka piersiowa": {
                "Wyciskanie hantli": {
                    repeatCount: 1,
                    seriesCount: 1
                }
            }
        }
    };

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

        'Barki': ['Wyciskanie hantli nad głowę', 'Wyciskanie hantli nad głową', 'Szrugsy', 'Wzniosy hantli bokiem'],
        'Biceps': ['Uginanie ramion ze sztangą prostą', 'Uginanie ramion z hantlami', 'Uginanie ramion ze sztangą łamaną'],
        'Triceps': ['Wyciskanie hantli zza głowy', 'Wyciskanie francuskie sztangi leżąc', 'Pompki na poręczach'],
        'Nogi': ['Przysiady', 'Wypychanie nóg na suwnicy', 'Prostowaie nóg siedząc', 'Prostowanie nóg leżąc'],
        'Brzuch': ['Brzuszki', 'Abbc', 'DDS', 'RRR'],

    }

    var detailedTemplate = '<div>' +
        '<input id="seriesCount" placeholder="Ilość serii"><br/>' +
        '<input id="repeatCount" placeholder="Liczba powtorzen">' +
        '</div>';

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


    //Kiedy klikam na save

    $('#saveDetails').on('click', function() {
        var selectedBodyPart = $('#musclegroup').val();
        var selectedExercise = $('#exercise').val();
        var seriesCount = $('#seriesCount').val();
        var repeatCount = $('#repeatCount').val();

        console.log('Saving...');
        // console.log('selectedBodyPart: ', selectedBodyPart);
        // console.log('selectedExercise: ', selectedExercise);
        // console.log('seriesCount: ', seriesCount);
        // console.log('repeatCount: ', repeatCount);

        // Check if any body part is selected
        if (selectedBodyPart.length < 1)  {
            console.log('Niewypelniony forumlarz!');
            return;
        }
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
        //dopiero jak zmiany sa zapisane w modelu to moge renderowac wynik
        renderAfterSave();

        	firebase
        		.database()
        		.ref('db')
        		.set(db);





    });






    function renderAfterSave() {

        $('#savedExercises').html(''); //czyszcze na samym poczatku bo jak zmieniam date chce miec czyste
        var resultHtml = ''; //tu bede doklejac wszystko
        var bodyParts = db[currentDate]; //klatka piersiowa, plecy, barki itd
        console.log('bodyParts', bodyParts);
        for (var item in bodyParts) {
            console.log(item);
            resultHtml += '<h3>' + item + '</h3>'; //kazdy body part bedzie w h3
            console.log('db[currentDate][item]', db[currentDate][item]);


            var exerciseObj = db[currentDate][item]; //dla kazdego body parta tworze obiekt zawierajacy wszystki cwiczenia
            for (var itemChild in exerciseObj) { //iteruje po obiekcie z cwiczeniami
                console.log(itemChild);
                resultHtml += '<h4>' + itemChild + '</h4>'; //kazde cwiczenie idzie do diva
                console.log('exerciseObj[itemChild]', exerciseObj[itemChild]);
                resultHtml += '<h5>Ilosc serii: ' + exerciseObj[itemChild].seriesCount + //seriesCount i repeatCount zawsze jest takie samo wiec moge tak sie do nich dostac (przez kropke)
                    ' <br>liczba powtorzen: ' + exerciseObj[itemChild].repeatCount + '</h5>';
            }
        }

        $('#savedExercises').html(resultHtml); //na koncu wstrzykuje do diva cale powyzsze
    }

    function changeMainView() {
        // http://bootstrap-datepicker.readthedocs.io/en/latest/markup.html
        // This is to save the embedded datepicker:
        var selectedDate = $('#datepicker').datepicker('getFormattedDate');
        console.log('selectedDate: ', selectedDate);
        currentDate = selectedDate;
        $('#selected-date').html(selectedDate);
        var selectedBodyPart = $('#musclegroup').val('');
        var selectedExercise = $('#exercise').val('');
        var seriesCount = $('#seriesCount').val('');
        var repeatCount = $('#repeatCount').val('');
        renderAfterSave();

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
