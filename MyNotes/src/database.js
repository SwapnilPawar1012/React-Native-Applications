import SQLite from 'react-native-sqlite-storage';

// Open database
const db = SQLite.openDatabase(
    { name: 'notes.db', location: 'default' },
    () => console.log('Database opened'),
    error => console.log('Error opening database:', error)
);

// Create Table
db.transaction(tx => {
    tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table';",
        [],
        (_, { rows }) => console.log('Tables:', rows._array),
        error => console.log('Error fetching tables:', error)
    );
});


// Save Note
export const saveNote = (title, content) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO Notes (title, content) VALUES (?, ?)',
            [title, content],
            (_, result) => {
                console.log('Note saved, Result:', result);
                getNotes(console.log); // Fetch immediately after inserting
            },
            error => console.log('Error saving note:', error)
        );
    });
};

// Edit Note
export const editNote = (id, newTitle, newContent, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE Notes SET title = ?, content = ? WHERE id = ?',
            [newTitle, newContent, id],
            () => {
                console.log('Note updated');
                callback(); // Fetch notes again after updating
            },
            error => console.log('Error updating note:', error)
        );
    });
};


// Get Notes
export const getNotes = (callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM Notes',
            [],
            (_, result) => {
                let notesArray = [];
                for (let i = 0; i < result.rows.length; i++) {
                    notesArray.push(result.rows.item(i)); // Extracting each row manually
                }
                console.log('Fetched notes:', notesArray);
                callback(notesArray);
            },
            error => console.log('Error fetching notes:', error)
        );
    });
};


// Delete Note
export const deleteNote = (id, callback) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM Notes WHERE id = ?',
            [id],
            () => {
                console.log('Note deleted');
                callback(); // Fetch notes again after deletion
            },
            error => console.log('Error deleting note:', error)
        );
    });
};

export default db;
