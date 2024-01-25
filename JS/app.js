const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit");
const edit = document.querySelector(".update");
const tbody = document.querySelector("table>tbody");

submitBtn.addEventListener('click', () => {
    let idb = indexedDB.open('curd');

    idb.onupgradeneeded = () => {
        let result = idb.result;
        result.createObjectStore('data', {autoIncrement: true});
    }
    idb.onsuccess = () => {
        let result = idb.result
        let trans = result.transaction('data', 'readwrite');
        let store = trans.objectStore('data');
        store.put({
            name: form[0].value,
            email: form[1].value,
            phone: form[2].value,
            address: form[3].value
        })
    }
    alert("Data has been added");
      location.reload();
})

function read() {
    let idb = indexedDB.open('curd');
    idb.onsuccess = () => {
      let result = idb.result;
      let trans = result.transaction("data", "readonly");
      let store = trans.objectStore("data");
      let cursor = store.openCursor();
      cursor.onsuccess = () => {
        let cursorResult = cursor.result;
        if (cursorResult) {
          console.log(cursorResult.value);
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
      };
    };
  }

  function del(e) {
    let idb = indexedDB.open("curd");
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
    let idb = indexedDB.open("curd");
    idb.onsuccess = () => {
      let result = idb.result;
      let trans = result.transaction("data", "readwrite");
      let store = trans.objectStore("data");
      store.put({
          name: form[0].value,
          email: form[1].value,
          phone: form[2].value,
          address: form[3].value,
        },updateKey);
      alert("Data has been update");
      location.reload();
    };
  });
  

  read();