export class ToDoTitle {
    constructor(data, docId) {
        this.title = data.title;
        this.uid = data.uid;
        this.timestamp = data.timestamp;
        this.deadline = data.deadline; // custom deadline for title
        this.docId = docId;
    }

    set_deadline(deadline){
        this.deadline = deadline;
    }

    set_docId(id){
        this.docId = id;
    }

    toFirestore() {
        return {
            title: this.title,
            uid: this.uid,
            timestamp: this.timestamp,
            deadline: this.deadline, // sends deadline data to firebase
        }
    }
}