import * as validation from "./validation.js";

$(function () {
    var hub = $.connection.ticTacToeHub;

    hub.client.showRoomsList = roomsData => {
        for (let room of roomsData) {
            addRoomToList('roomsList', createLiFromGroup(room));
        }
    }

    hub.client.hideRoom = roomName => {
        $(`#${roomName}`).remove();
    }

    hub.client.createRoom = roomData => {
        addRoomToList('roomsList', createLiFromGroup(roomData))

        $('[id$=JoinButton]').click(function () {
            let roomName = $(this).prop('id').slice(0, -10);
            hub.server.joinRoom(roomName);
        });
    }

    hub.client.addRoomName = roomName => {
        $('#roomName').val(roomName);
        $('#title').append(roomName);
    }

    hub.client.changeLocation = () => {
        $('#menuCard, #playingCard').toggleClass('d-none');
    }

    hub.client.changeRoomState = () => {
        $('#waitingPanel, #gameField').toggleClass('d-none');
    }

    hub.client.setFieldData = (field) => {
        for (let i = 0; i < 9; i++) {
            if (field[parseInt(i / 3)][i % 3] == 1) {
                $('#gameField span[id^=block]').eq(i).addClass('fa-close');
            }
            if (field[parseInt(i / 3)][i % 3] == 0) {
                $('#gameField span[id^=block]').eq(i).addClass('fa-circle-o');
            }
        }
    }

    hub.client.drawRedirect = () => { alert('Draw'); this.location.href = this.location.href};
    hub.client.winnerRedirect = () => { alert('Win'); this.location.href = this.location.href };
    hub.client.loserRedirect = () => { alert('Defeat'); this.location.href = this.location.href};

    hub.client.loadFieldForCurrent = (field) => {
        hub.client.setFieldData(field);
        $('#gameField span[id^=block]').one('click', function () {
            if (!$(this).hasClass('fa-close') && !$(this).hasClass('fa-circle-o')) {
                hub.server.synchronizeField($(this).attr('id').slice(5));
                $('#gameField span[id^=block]').off('click');
                hub.server.loadField();
            }
        })
    }

    hub.client.loadFieldForOther = (field) => {
        hub.client.setFieldData(field);
    }

    hub.client.filterRooms = (roomName, tag) => {
        let obj = hub.server.filter(roomName, tag);
        for (let el in obj) {
            alert(obj[el]);
        }
    }

    $('#tagsSearch').on('keyup', function () {
        $('#roomsList li').removeClass('list-group-item-warning');
        $(`#roomsList li[name^=${$('#tagsSearch').val()}]`).addClass('list-group-item-warning');
    });

    var tab_attribs = [];

    $('#tagsSearch').click(function () {
        $('[id$=Tag]').each(function () {
            if (tab_attribs.indexOf($(this).val()) == -1) {
                tab_attribs.push($(this).val());
            }
        });
    })

    $("#tagsSearch").autocomplete({
        source: tab_attribs,
        messages: {
            noResults: '',
            results: function () { }
        }
    });

    $.connection.hub.start().done(function () {
        $('#roomCreateButton').click(function () {
            if (validation.isTagNameValid($("#tagsSearch").val()) && validation.isRoomNameValid($("#roomNameSearch").val())) {
                hub.server.createRoom({
                    Name: $('#roomNameSearch').val(),
                    Tag: $('#tagsSearch').val()
                });
            }
        });

        $('[id$=JoinButton]').click(function () {
            let roomName = $(this).prop('id').slice(0, -10);
            hub.server.joinRoom(roomName);
            
        });
    })


   

})


function addRoomToList(listId, roomHtml) {
    $(`#${listId}`).append(roomHtml);
}

function createLiFromGroup(group) {
    return `<li id=${group.Name} name=${group.Tag} class="roomWrapper list-group-item d-flex justify-content-between align-items-center">
                    ${group.Name}
                    <button id="${group.Name}JoinButton" class="btn badge badge-primary badge-pill">
                        Join
                    </button>
                    <input id="${group.Name}Tag" type="hidden" value="${group.Tag}">
            </li>`
}

