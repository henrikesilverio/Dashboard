var dataTableSettings = {
    "data": [],
    "dom": "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-12'<'d-flex justify-content-center'p>>>",
    "pageLength": 10,
    "ordering": false,
    "language": {
        "zeroRecords": "Não há registrados",
        "info": "_START_ a _END_ em _TOTAL_ Log(s)",
        "infoEmpty": "",
        "infoFiltered": "(filtrado do total de _MAX_ registros)",
        "search": "Filtrar resultado",
        "paginate": {
            "previous": "",
            "next": ""
        }
    },
    "columns": [],
    "drawCallback": function () {
        $("[data-toggle='tooltip']").tooltip();
    }
};

var table = {};

$.ajax({
    url: 'https://dashboard-722d3.firebaseio.com/.json',
    success: function (data) {
        data.columns.forEach(function (element) {
            switch (element.displayType) {
                case 0:
                    dataTableSettings.columns.push({
                        "data": element.property,
                        "title": element.value
                    });
                    break;
                case 1:
                    dataTableSettings.columns.push({
                        "data": element.property,
                        "title": element.value,
                        "class": "text-center",
                        "render": buildIcon
                    });
                    break;
                case 2:
                    dataTableSettings.columns.push({
                        "data": element.property,
                        "title": element.value,
                        "class": "text-center",
                        "render": buildBadge
                    });
                    break;
            }
        });
        dataTableSettings.data = data.lines;
        table = $("#dashboard").DataTable(dataTableSettings);
    }
});

function refreshData() {
    $.ajax({
        url: 'https://dashboard-722d3.firebaseio.com/.json',
        success: function (data) {
            table.clear();
            table.rows.add(data.lines);
            table.draw();
        }
    });
}

function buildBadge(data) {
    switch (data) {
        case 0:
            return "<span class='font-weight-bold text-secondary'>Não definido</span>";
        case 1:
            return "<span class='font-weight-bold text-primary'>Ordinário</span>";
        case 2:
            return "<span class='font-weight-bold text-success'>Normal</span>";
        case 3:
            return "<span class='font-weight-bold text-warning'>Urgente</span>";
        case 4:
            return "<span class='font-weight-bold text-danger'>Emergência</span>";
    }
}

function getHtmlIcon(classIcon, title) {
    return $("<span>").attr({
        "class": "fa fa-lg " + classIcon,
        "data-toggle": "tooltip",
        "data-placement": "top",
        "title": title
    })[0].outerHTML;
}

function buildIcon(data) {
    switch (data.value) {
        case 0:
            return getHtmlIcon("fa-minus text-muted", data.lastAlarm);
        case 1:
            return getHtmlIcon("fa-circle text-primary", data.lastAlarm);
        case 2:
            return getHtmlIcon("fa-circle text-success", data.lastAlarm);
        case 3:
            return getHtmlIcon("fa-circle text-warning", data.lastAlarm);
        case 4:
            return getHtmlIcon("fa-circle text-danger", data.lastAlarm);
    }
}

$('#search').keyup(function () {
    table.search($(this).val()).draw();
});

var currentInt = 1;
var intervalAutomaticRotation = {};
var intervalRefreshTime = {};
var timer = 3000;

$("#automatic-rotation").on("click", function () {
    var pageInfo = table.page.info();

    if (this.checked) {
        intervalAutomaticRotation = setInterval(function () {
            table.page(currentInt).draw('page');
            currentInt++;
            if (currentInt === pageInfo.pages) {
                currentInt = 0;
            }
        }, (timer + 300));
    } else {
        clearInterval(intervalAutomaticRotationk);
    }
});

$("#refresh-time").on("click", function () {
    if (this.checked) {
        intervalRefreshTime = setInterval(refreshData, ($("#time-in-millisec").val()));
    } else {
        clearInterval(intervalRefreshTime);
    }
});