// 

const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML ROUTES
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// API ROUTES
app.get('/api/notes', (req, res) => {
    const notesJson = fs.readFileSync(path.join(__dirname, 'db', 'db.json'));
    const notes = JSON.parse(notesJson.toString());
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`)
    // Read the current notes from the db.json file
    notesJson = fs.readFileSync(path.join(__dirname, 'db', 'db.json'));
    notes = JSON.parse(notesJson);
  
    // Generate a new note object
    const newNoteId = Date.now().toString();
    const newNote = {
      id: newNoteId,
      title: req.body.title,
      text: req.body.text
    };
  
    // Add the new note to the array of notes
    notes.push(newNote);
  
    // Write the updated notes array back to the db.json file
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
  
    // Respond with the new note object
    res.json(newNote);
});

// Route to delete notes
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received to delete a note`)
    // Read the current notes from the db.json file
    const notesJson = fs.readFileSync(path.join(__dirname, 'db', 'db.json'));
    let notes = JSON.parse(notesJson);
    const noteId = req.params.id;
    
    // Find the note with the matching ID and remove it from the notes array
    notes = notes.filter(note => note.id !== noteId);
    
    // Write the updated notes array back to the db.json file
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
    
    // Respond with a success message
    res.send(`Note with ID ${noteId} has been deleted`);
  });

// Default route
app.get('*', (req, res) => {
    let indexPath = path.join(__dirname, 'public/index.html');
    let reqPath = path.join(__dirname, "public", req.path);
    if (fs.existsSync(reqPath)) {
        res.sendFile(reqPath);
    } else {
        res.sendFile(indexPath);
    }
});

// Sends error if present
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!')
});

// Console log if server is running
app.listen(PORT, () => {
    console.log('listening on port 3001')
});