const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit");
const edit = document.querySelector(".update");
const tbody = document.querySelector("table>tbody");

submitBtn.addEventListener('click', () => {
  let isEmptyField = false;

  for(let i=0; i < form.length; i++){
    if(form[i].value.trim() === ""){
      alert("please fill in all fields before submitting.");
      return;
    }else {
      isEmptyField = true;
      break;
    }
  }

  let idb = indexedDB.open('CURD', 1);
  idb.onupgradeneeded = () => {
      let result = idb.result;
      result.createObjectStore('data', {autoIncrement: true})
  }
  idb.onsuccess = () => {
      let result = idb.result;
      let trans = result.transaction('data', 'readwrite');
      let store = trans.objectStore('data');
      store.put({
          name: form[0].value,
          email: form[1].value,
          phone: form[2].value,
          address: form[3].value,
      })
      trans.oncomplete = () => {
        alert("Data has been added");
        location.reload();
      }
  }
})

function read() {
  let idb = indexedDB.open("CURD", 1);

  idb.onsuccess = () => {
      let result = idb.result;
      let trans = result.transaction('data', 'readonly');
      let store = trans.objectStore('data');
      let cursor = store.openCursor();

      cursor.onsuccess = () => {
          let cursorResult = cursor.result;
          if(cursorResult){
              tbody.innerHTML += `<tr>
              <td>${cursorResult.value.name}</td>
              <td>${cursorResult.value.email}</td>
              <td>${cursorResult.value.phone}</td>
              <td>${cursorResult.value.address}</td>
              <td onclick="update(${cursorResult.key})" class="up">Update</td>
              <td onclick="del(${cursorResult.key})" class="de">Delete</td>
              </tr>`;
          cursorResult.continue();
          }
      }
  }

}

  function del(e) {
    let idb = indexedDB.open("CURD");
    idb.onsuccess = () => {
      let result = idb.result;
      let trans = result.transaction("data", "readwrite");
      let store = trans.objectStore("data");
      store.delete(e);
      alert("Data has been deleted");
      location.reload();
    };
  }

let updateKey;

function update(e) {
  submitBtn.style.display = "none";
  edit.style.display = "block";
  updateKey = e;
}

edit.addEventListener("click", () => {
  let idb = indexedDB.open("CURD");
  idb.onsuccess = () => {
    let result = idb.result;
    let trans = result.transaction("data", "readwrite");
    let store = trans.objectStore("data");
    let getRequest = store.get(updateKey);

    getRequest.onsuccess = () => {
      let existingData = getRequest.result;

      // Update fields only if the corresponding form field has a value
      if (form[0].value.trim() !== "") {
        existingData.name = form[0].value;
      }
      if (form[1].value.trim() !== "") {
        existingData.email = form[1].value;
      }
      if (form[2].value.trim() !== "") {
        existingData.phone = form[2].value;
      }
      if (form[3].value.trim() !== "") {
        existingData.address = form[3].value;
      }

      // Put the updated data back into the store
      store.put(existingData, updateKey);

      alert("Data has been updated");
      location.reload();
    };

    getRequest.onerror = () => {
      console.error("Error retrieving data for update");
    };
  };
});

// Assuming read() is a function that reads data from the store
read();

