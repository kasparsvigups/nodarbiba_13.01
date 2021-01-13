let template = document.querySelector(".template");
let count = localStorage.getItem("task_count");

if (count === null && count != Number(count)) {
  count = 0;
}

document
  .querySelector(".new-task")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let textarea = this.querySelector("textarea");
    count++;
    addTask(textarea.value, false, count);
    textarea.value = "";
  });

function addTask(text, status, order) {
  if (text !== "") {
    let task = template.cloneNode(true);
    task.setAttribute("data-order", order);
    task.classList.remove("template");
    if (status) {
      task.classList.add("done");
    }
    task.querySelector("pre").textContent = text;
    localStorage.setItem("task[" + order + "]", JSON.stringify([text, status]));
    localStorage.setItem("task_count", order);

    /*
      Notikums kad uzdevums ir izpildīts
      */
    task.addEventListener("click", function () {
      if (!this.classList.contains("editable")) {
        this.classList.toggle("done");
        localStorage.setItem(
          "task[" + order + "]",
          JSON.stringify([text, this.classList.contains("done")])
        );
      }
    });

    /*
      Notikums pie klikšķa uz option
      */
    task.querySelector(".option").addEventListener("click", function (event) {
      event.stopPropagation();
      task.querySelector(".options").classList.toggle("active");
    });

    /*
      Notikums pie klikšķa uz edit
      */
    task.querySelector(".edit").addEventListener("click", function (event) {
      event.stopPropagation();
      if (!task.classList.contains("done")) {
        task.querySelector("pre").setAttribute("contenteditable", true);
        task.classList.add("editable");
        task.querySelector(".options").classList.remove("active");
      }
    });

    /*
      Notikums pie klikšķa uz save
      */
    task.querySelector(".save").addEventListener("click", function (event) {
      event.stopPropagation();
      task.classList.remove("editable");
      localStorage.setItem(
        "task[" + order + "]",
        JSON.stringify([task.querySelector("pre").textContent, true])
      );
      task.querySelector("pre").removeAttribute("contenteditable");
    });

    /*
      Notikums pie klikšķa uz remove
      */
    task.querySelector(".remove").addEventListener("click", function (event) {
      event.stopPropagation();
      for (let i = order; i < count; i++) {
        localStorage.setItem(
          "task[" + i + "]",
          localStorage.getItem("task[" + (i + 1) + "]")
        );
      }

      localStorage.removeItem("task[" + count + "]");

      count--;
      localStorage.setItem("task_count", count);
      task.remove();
    });

    document.querySelector(".task-list").append(task);
  }
}

for (let i = 1; i <= count; i++) {
  let item = JSON.parse(localStorage.getItem("task[" + i + "]"));
  addTask(item[0], item[1], i);
}
