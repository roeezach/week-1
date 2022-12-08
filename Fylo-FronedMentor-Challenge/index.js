
let MaxFilesSize = parseFloat(10);
let currentFilesSize = parseFloat(0);
let spaceLeft = MaxFilesSize - currentFilesSize;
let isValid = true;

UpdateHtml()

function ValidateFiles() {

    const fileUpload = document.getElementById("files");

    for (let i = 0; i < fileUpload.files.length; i++) {
        let file = fileUpload.files[i];
        let allowedFiles = [".jpg", ".gif", ".jpeg", "png"];
        const regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$");

        ValidateExtension(file, regex);
        ValidateSize(file);
    }

    function ValidateExtension(file, regex) {
        if (!regex.test(file.name.toLowerCase())) {
            alert('File Format is not supported');
            fileUpload.value = '';
            isValid = false;
        }
        else
            isValid = true
    }

    function ValidateSize(file) {

        const fileSize = file.size;
        let fileMb = parseFloat(fileSize / (1024 * 1024))
        console.log(fileMb)
        if (fileMb > spaceLeft) {
            alert("There is not enough space on the disk , the file name was " + file.name)
        }
        else {
            UploadFile(file);
            UpdateProgress(fileMb);
        }
    }
}

function UploadFile(file) {

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        if (isValid) {
            SaveImageToSessionStorage(reader);
        }
    })
    reader.readAsDataURL(file);
}

function SaveImageToSessionStorage(reader) {
    sessionStorage.setItem("recent-image", reader.result);
}

function UpdateProgress(fileMb) {
    if (isValid) {
        currentFilesSize = parseFloat(sessionStorage.getItem("usedStorage") || 0) + parseFloat(fileMb || 0)
        console.log("the space left " + spaceLeft)
        console.log("current file size before ss " + currentFilesSize)
        console.log("current file size in MB for FileMB item " + fileMb)


        sessionStorage.setItem("usedStorage", parseFloat(currentFilesSize));

        spaceLeft = MaxFilesSize - currentFilesSize;
        sessionStorage.setItem("spaceLeft", spaceLeft);

        UpdateHtml();
    }
}

function UpdateHtml() {
    let ssSpaceLeft = parseFloat(sessionStorage.getItem("spaceLeft"))
    let ssCurrentStorage = parseFloat(sessionStorage.getItem("usedStorage"))
    if (isNaN(ssCurrentStorage)) {
        document.getElementById('storageUsed').innerHTML = currentFilesSize;
        document.getElementById('myProgress').innerHTML = currentFilesSize;
    }
    else {
        document.getElementById('storageUsed').innerHTML = parseFloat(sessionStorage.getItem("usedStorage")).toFixed(2);
        document.getElementById("myProgress").value = parseFloat(sessionStorage.getItem("usedStorage"));
    }

    if (isNaN(ssSpaceLeft))
        document.getElementById('storageLeft').innerHTML = MaxFilesSize;
    else
        document.getElementById('storageLeft').innerHTML = parseFloat(sessionStorage.getItem("spaceLeft")).toFixed(2);
}

