function isTagNameValid(tagName) {

    if (!/^([A-Z]|[a-z])[A-Za-z0-9]{1,10}$/.test(tagName)) {
        alert('Invalid tag name value!');
        return false;
    }
    return true;
}

function getRoomsList() {
    var tabAttribs = [];
    $('[class~=roomWrapper]').each(function () {
        tabAttribs.push($(this).prop('id'));
    });
    return tabAttribs;
}

function isRoomNameValid(roomName) {

    if (!/^([A-Z]|[a-z])[A-Za-z0-9]{1,15}$/.test(roomName)) {
        alert('Invalid room name value!');
        return false;
    }

    if (getRoomsList().indexOf(roomName) != -1) {
        alert('This room name has already been used!');
        return false;
    }
    return true;
}

export { isTagNameValid, isRoomNameValid };
