var dataTableSettings = {
    "data": [],
    "dom": "<'row'<'col-sm-12 col-md-12'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-12'<'d-flex justify-content-center'p>>>",
    "pageLength": 8,
    "language": {
        "zeroRecords": "Não há registrados",
        "info": "_START_ a _END_ em _TOTAL_ Log(s)",
        "infoEmpty": "",
        "infoFiltered": "(filtrado do total de _MAX_ registros)",
        "search": "Filtrar resultado",
        "paginate": {
            "previous": "Anterior",
            "next": "Próximo"
        }
    },
    "columns": [
        { "data": "company", "width": "30%" },
        { "data": "substation", "width": "25%" },
        { "data": "active", "width": "10%" },
        { "data": "status", "width": "5%" },
        { "data": "temp", "width": "5%" },
        { "data": "gas", "width": "5%" },
        { "data": "bush", "width": "5%" },
        { "data": "signals", "width": "5%" },
        { "data": "oltc", "width": "5%" },
        { "data": "membrane", "width": "5%" }
    ]
};

var table = $("#dashboard").DataTable(dataTableSettings);

for (var i = 0; i < 100; i++) {
    table.rows.add([{
        "company": "CPFL Renováveis " + i,
        "substation": "SUBES " + i,
        "active": i,
        "status": i % 3,
        "temp": i % 3,
        "gas": i % 3,
        "bush": i % 3,
        "signals": i % 3,
        "oltc": i % 3,
        "membrane": i % 3
    }]);
}

table.draw();
