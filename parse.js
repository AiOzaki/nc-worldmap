
document.getElementById('selectFiles').addEventListener('change', function (e) {

    var files = document.getElementById('selectFiles').files;
    console.log("-----------");
    console.log(files);
    console.log("-----------");
    if (files.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    var values = {}
    fr.onload = function (e) {
        var elm = document.getElementById('svgMapDataNC');
        elm.innerHTML = ''
        console.log(e);
        var result = JSON.parse(e.target.result);
        for (let item in result.lesson_logs) {
            var country_name = result.lesson_logs[item].nationality;
            var teacher_id = result.lesson_logs[item].teacher_id;
            if (country_name != undefined) {
                country_name = country_name.toLowerCase().replace(/\s+/g, "");
                country_code = country2code[country_name];

                if (country_code == undefined) {
                    for (let key in country2code) {
                        if (key.match(country_name) || country_name.match(key)) {
                            country_code = country2code[key];
                        }
                    }
                }

            }
            if (!values[country_code]) {
                values[country_code] = { lessons: 0, teachers: [] };
            }
            values[country_code].lessons++;
            if (!values[country_code].teachers.includes(teacher_id)) {
                values[country_code].teachers.push(teacher_id);
            }

        }
        for (let key in values) {
            values[key].teachers = values[key].teachers.length;
        }
        var svgMapDataNC = {
            data: {
                lessons: {
                    name: 'レッスン数',
                    format: '{0} 回'
                },
                teachers: {
                    name: '先生の数',
                    format: '{0} 人'
                }
            },
            applyData: 'lessons',
            values
        };
        console.log(svgMapDataNC);
        // var formatted = JSON.stringify(result.lesson_logs, null, 2);
        // document.getElementById('result').value = formatted;
        new svgMap({
            targetElementID: 'svgMapDataNC',
            data: svgMapDataNC,
            flagType: 'emoji',
            colorMin: '#99FF66',
            colorMax: '#009966',
            thresholdMin: 1,
            noDataText: 'どんな先生に会えるかな😌'
        });
    }

    fr.readAsText(files.item(0));

});