import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note Deleted!");
        else alert("Failed to delete note");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note Created!");
        else alert("Failed to create note");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <div>
        <div className="notes-header">
          <h2>Notes</h2>
          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem(ACCESS_TOKEN);
              localStorage.removeItem(REFRESH_TOKEN);
              navigate("/login");
            }}
          >
            Log Out
          </button>
        </div>

        <div className="notes-container">
          {notes.map((note) => (
            <Note key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      </div>

      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          name="content"
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Home;
